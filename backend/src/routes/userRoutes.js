const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

/**
 * @route   GET /api/users/profile
 * @desc    Obtenir le profil de l'utilisateur actuel
 * @access  Protégé
 */
router.get('/profile', auth, userController.getProfile.bind(userController));

/**
 * @route   PUT /api/users/profile
 * @desc    Mettre à jour le profil de l'utilisateur actuel
 * @access  Protégé
 */
router.put('/profile', auth, userController.updateProfile.bind(userController));

/**
 * @route   GET /api/users
 * @desc    Obtenir tous les utilisateurs
 * @access  Admin uniquement
 */
router.get('/', auth, roleCheck('ADMIN'), userController.getAllUsers.bind(userController));

/**
 * @route   GET /api/users/:id
 * @desc    Obtenir un utilisateur par ID
 * @access  Admin uniquement
 */
router.get('/:id', auth, roleCheck('ADMIN'), userController.getUserById.bind(userController));

module.exports = router;
