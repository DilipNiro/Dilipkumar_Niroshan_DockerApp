const genreService = require('../services/genreService');

class GenreController {
  /**
   * Obtenir tous les genres
   * @route GET /api/genres
   * @access Public
   */
  async getAllGenres(req, res) {
    try {
      const genres = await genreService.getAllGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching genres',
        details: error.message
      });
    }
  }
}

module.exports = new GenreController();

