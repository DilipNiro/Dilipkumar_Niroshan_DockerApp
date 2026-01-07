const movieService = require('../services/movieService');

class MovieController {
  /**
   * Obtenir tous les films
   * @route GET /api/movies
   * @access Public
   */
  async getAllMovies(req, res) {
    try {
      const { genre, year, search } = req.query;
      const movies = await movieService.getAllMovies({ genre, year, search });

      res.json(movies);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching movies',
        details: error.message
      });
    }
  }

  /**
   * Obtenir un film par ID
   * @route GET /api/movies/:id
   * @access Public
   */
  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovieById(id);

      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching movie',
        details: error.message
      });
    }
  }

  /**
   * Créer un nouveau film
   * @route POST /api/movies
   * @access Admin uniquement
   */
  async createMovie(req, res) {
    try {
      const movie = await movieService.createMovie(req.body);

      res.status(201).json(movie);
    } catch (error) {
      if (error.message.includes('Required fields')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error creating movie',
        details: error.message
      });
    }
  }

  /**
   * Mettre à jour un film existant
   * @route PUT /api/movies/:id
   * @access Admin uniquement
   */
  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieService.updateMovie(id, req.body);

      res.json(movie);
    } catch (error) {
      if (error.message === 'Movie not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error updating movie',
        details: error.message
      });
    }
  }

  /**
   * Supprimer un film
   * @route DELETE /api/movies/:id
   * @access Admin uniquement
   */
  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      await movieService.deleteMovie(id);

      res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
      if (error.message === 'Movie not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error deleting movie',
        details: error.message
      });
    }
  }
}

module.exports = new MovieController();
