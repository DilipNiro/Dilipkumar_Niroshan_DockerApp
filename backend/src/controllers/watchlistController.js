const watchlistService = require('../services/watchlistService');

class WatchlistController {
  /**
   * Obtenir la watchlist de l'utilisateur
   * @route GET /api/watchlist
   * @access Protégé
   */
  async getUserWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const watchlist = await watchlistService.getUserWatchlist(userId, status);

      res.json(watchlist);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching watchlist',
        details: error.message
      });
    }
  }

  /**
   * Ajouter un film à la watchlist
   * @route POST /api/watchlist
   * @access Protégé
   */
  async addToWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { movieId, status } = req.body;

      if (!movieId) {
        return res.status(400).json({ error: 'movieId is required' });
      }

      const item = await watchlistService.addToWatchlist(userId, movieId, status);

      res.status(201).json(item);
    } catch (error) {
      if (error.message === 'Movie not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Movie already in watchlist') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error adding to watchlist',
        details: error.message
      });
    }
  }

  /**
   * Mettre à jour le statut d'un élément de la watchlist
   * @route PUT /api/watchlist/:id
   * @access Protégé
   */
  async updateStatus(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'status is required' });
      }

      const item = await watchlistService.updateStatus(parseInt(id), userId, status);

      res.json(item);
    } catch (error) {
      if (error.message === 'Watchlist item not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error updating watchlist status',
        details: error.message
      });
    }
  }

  /**
   * Retirer de la watchlist
   * @route DELETE /api/watchlist/:id
   * @access Protégé
   */
  async removeFromWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await watchlistService.removeFromWatchlist(parseInt(id), userId);

      res.json({ message: 'Removed from watchlist' });
    } catch (error) {
      if (error.message === 'Watchlist item not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error removing from watchlist',
        details: error.message
      });
    }
  }

  /**
   * Retirer de la watchlist par ID de film
   * @route DELETE /api/watchlist/movie/:movieId
   * @access Protégé
   */
  async removeByMovieId(req, res) {
    try {
      const userId = req.user.id;
      const { movieId } = req.params;

      await watchlistService.removeByMovieId(userId, parseInt(movieId));

      res.json({ message: 'Removed from watchlist' });
    } catch (error) {
      if (error.message === 'Movie not in watchlist') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error removing from watchlist',
        details: error.message
      });
    }
  }
}

module.exports = new WatchlistController();
