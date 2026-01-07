const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const auth = require('../middleware/auth');
const { validateWatchlistStatus } = require('../middleware/validation');

/**
 * @route   GET /api/watchlist
 * @desc    Obtenir la watchlist de l'utilisateur avec filtre de statut optionnel
 * @access  Protégé
 */
router.get('/', auth, watchlistController.getUserWatchlist.bind(watchlistController));

/**
 * @route   POST /api/watchlist
 * @desc    Ajouter un film à la watchlist
 * @access  Protégé
 */
router.post(
  '/',
  auth,
  validateWatchlistStatus,
  watchlistController.addToWatchlist.bind(watchlistController)
);

/**
 * @route   PUT /api/watchlist/:id
 * @desc    Mettre à jour le statut d'un élément de la watchlist
 * @access  Protégé
 */
router.put(
  '/:id',
  auth,
  validateWatchlistStatus,
  watchlistController.updateStatus.bind(watchlistController)
);

/**
 * @route   DELETE /api/watchlist/:id
 * @desc    Retirer de la watchlist par ID d'élément
 * @access  Protégé
 */
router.delete('/:id', auth, watchlistController.removeFromWatchlist.bind(watchlistController));

/**
 * @route   DELETE /api/watchlist/movie/:movieId
 * @desc    Retirer de la watchlist par ID de film
 * @access  Protégé
 */
router.delete('/movie/:movieId', auth, watchlistController.removeByMovieId.bind(watchlistController));

module.exports = router;
