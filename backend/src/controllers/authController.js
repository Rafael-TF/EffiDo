const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario o email ya existe' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    // console.log('Token generado para el nuevo usuario:', verificationToken);

    const user = new User({ 
      username, 
      email, 
      password,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
    });
    await user.save();
    // console.log('Nuevo usuario registrado:', JSON.stringify(user, null, 2));

    // Verificar que el usuario se guardó correctamente
    const savedUser = await User.findOne({ email });
    // console.log('Usuario recuperado de la base de datos:', JSON.stringify(savedUser, null, 2));

    await sendVerificationEmail(user.email, verificationToken);
    // console.log('Email de verificación enviado a:', user.email);

    res.status(201).json({ message: 'Usuario registrado. Por favor, verifica tu email.' });
  } catch (error) {
    // console.error('Error en el registro:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log('Intento de inicio de sesión para:', email);

    const user = await User.findOne({ email }).lean();
    // console.log('Usuario encontrado:', JSON.stringify(user, null, 2));

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log('¿Contraseña válida?', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Contraseña inválida');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // console.log('Estado de verificación de email:', user.isEmailVerified);
    if (user.isEmailVerified === false) {
      console.log('Email no verificado, rechazando inicio de sesión');
      return res.status(403).json({ message: 'Por favor, verifique su email antes de acceder a la cuenta' });
    }

    console.log('Inicio de sesión exitoso');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token requerido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.userId, refreshToken });

    if (!user) {
      return res.status(403).json({ message: 'Refresh Token inválido' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh Token inválido' });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    console.log('Received forgot password request for email:', req.body.email);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('No user found with email:', req.body.email);
      return res.status(404).json({ message: 'No existe un usuario con ese correo electrónico' });
    }

    console.log('User found, creating reset token');
    const resetToken = user.createPasswordResetToken();
    console.log('Reset token created');

    console.log('Saving user');
    await user.save({ validateBeforeSave: false });
    console.log('User saved');

    console.log('Attempting to send password reset email');
    // Cambia esta línea:
    await sendPasswordResetEmail(user.email, resetToken);

    console.log('Password reset email sent successfully');
    res.status(200).json({ message: 'Token enviado al correo electrónico' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    
    if (error.message === 'Error al enviar el correo electrónico de restablecimiento de contraseña') {
      return res.status(500).json({ message: 'Error al enviar el correo electrónico de restablecimiento de contraseña' });
    }

    res.status(500).json({ message: 'Error al procesar la solicitud de restablecimiento de contraseña' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // console.log('Token recibido:', token);
    // console.log('Nueva contraseña recibida:', password ? 'Sí' : 'No');

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('No se encontró usuario con el token proporcionado');
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // console.log('Contraseña restablecida exitosamente para el usuario:', user.email);

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(400).json({ message: 'Error al restablecer la contraseña', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log('Token recibido para verificación:', token);

    const user = await User.findOne({ verificationToken: token });
    // console.log('Usuario encontrado para verificación:', JSON.stringify(user, null, 2));

    if (!user) {
      console.log('No se encontró usuario con el token proporcionado');
      return res.status(400).json({ message: 'Token de verificación inválido' });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    // console.log('Usuario verificado exitosamente:', JSON.stringify(user, null, 2));

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ message: 'Email verificado exitosamente', token: authToken, userId: user._id });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({ message: 'Error al verificar el email', error: error.message });
  }
};