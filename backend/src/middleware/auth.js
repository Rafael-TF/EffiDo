import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Por favor, verifica tu email antes de acceder' });
    }

    req.user = { id: user._id };
    next();
  } catch (error) {
    // console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Autenticación fallida' });
  }
};

export default authMiddleware;