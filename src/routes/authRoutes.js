const express = require('express');
const { register, login, getProfile, updateProfile, upgradeToArtisan } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/upgrade-to-artisan', authMiddleware, upgradeToArtisan);

module.exports = router;
