const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // Añade esta línea

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Auth test route works!' });
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', auth, authController.logout);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;