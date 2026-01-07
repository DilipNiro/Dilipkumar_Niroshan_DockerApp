const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

/**
 * @route   GET /api/genres
 * @desc    Obtenir tous les genres
 * @access  Public
 */
router.get('/', genreController.getAllGenres.bind(genreController));

module.exports = router;

