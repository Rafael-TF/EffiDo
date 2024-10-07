const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: accessToken
  }
});

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://effido.onrender.com' 
  : 'http://localhost:3000';

exports.sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `${BASE_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Restablecimiento de contraseña',
    html: `
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('Password reset email sent successfully');
  } catch (error) {
    // console.error('Error sending password reset email:', error);
    throw new Error('Error al enviar el correo electrónico de restablecimiento de contraseña');
  }
};

exports.sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${BASE_URL}/verify-email/${encodeURIComponent(token)}`;
  // console.log('URL de verificación generada:', verificationUrl);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Verifica tu dirección de email',
    html: `
      <p>Por favor, verifica tu dirección de email haciendo clic en el siguiente enlace:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Este enlace expirará en 24 horas.</p>
      <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('Email de verificación enviado a:', to);
  } catch (error) {
    // console.error('Error al enviar email de verificación:', error);
    throw error;
  }
};

// exports.sendVerificationEmail = async (to, verificationToken) => {
//   const verificationUrl = `http://localhost:3000/verify-email/${verificationToken}`;

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: to,
//     subject: 'Verifica tu dirección de email',
//     html: `
//       <p>Por favor, verifica tu dirección de email haciendo clic en el siguiente enlace:</p>
//       <a href="${verificationUrl}">${verificationUrl}</a>
//       <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email de verificación enviado a:', to);
//   } catch (error) {
//     console.error('Error al enviar email de verificación:', error);
//     throw error;
//   }
// };