const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateSignup } = require('../middleware/validation');

/**
 * @route   POST /api/auth/signup
 * @desc    Enregistrer un nouvel utilisateur
 * @access  Public
 */
router.post('/signup', validateSignup, authController.signup.bind(authController));

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir le profil de l'utilisateur actuel
 * @access  Protégé
 */
router.get('/me', auth, authController.getCurrentUser.bind(authController));

module.exports = router;
