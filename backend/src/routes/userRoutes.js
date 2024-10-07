const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'public', 'avatars'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/change-password', auth, userController.changePassword);
router.delete('/delete-account', auth, userController.deleteAccount);
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// Nuevas rutas para estadísticas y logros
router.get('/stats', auth, userController.getUserStats);
router.get('/achievements', auth, userController.getUserAchievements);

module.exports = router;
