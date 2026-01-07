const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { validateMovie } = require('../middleware/validation');

/**
 * @route   GET /api/movies
 * @desc    Obtenir tous les films avec filtres optionnels
 * @access  Public
 */
router.get('/', movieController.getAllMovies.bind(movieController));

/**
 * @route   GET /api/movies/:id
 * @desc    Obtenir un film par ID
 * @access  Public
 */
router.get('/:id', movieController.getMovieById.bind(movieController));

/**
 * @route   POST /api/movies
 * @desc    Créer un nouveau film
 * @access  Admin uniquement
 */
router.post(
  '/',
  auth,
  roleCheck('ADMIN'),
  validateMovie,
  movieController.createMovie.bind(movieController)
);

/**
 * @route   PUT /api/movies/:id
 * @desc    Mettre à jour un film
 * @access  Admin uniquement
 */
router.put(
  '/:id',
  auth,
  roleCheck('ADMIN'),
  validateMovie,
  movieController.updateMovie.bind(movieController)
);

/**
 * @route   DELETE /api/movies/:id
 * @desc    Supprimer un film
 * @access  Admin uniquement
 */
router.delete(
  '/:id',
  auth,
  roleCheck('ADMIN'),
  movieController.deleteMovie.bind(movieController)
);

module.exports = router;
