const prisma = require('../config/database');
const genreService = require('./genreService');

class MovieService {
  /**
   * Obtenir tous les films avec filtres optionnels
   * @param {Object} filters - {genre?, year?, search?}
   * @returns {Promise<Array>} Liste des films
   */
  async getAllMovies(filters = {}) {
    const where = {};

    if (filters.genre) {
      where.genres = {
        some: {
          genre: {
            name: { contains: filters.genre, mode: 'insensitive' }
          }
        }
      };
    }

    if (filters.year) {
      where.year = parseInt(filters.year);
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { director: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.movie.findMany({
      where,
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Obtenir un film par ID
   * @param {number} id - ID film
   * @returns {Promise<Object|null>} Objet film ou null
   */
  async getMovieById(id) {
    return await prisma.movie.findUnique({
      where: { id: parseInt(id) },
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      }
    });
  }

  /**
   * Créer un nouveau film
   * @param {Object} movieData - Données du film
   * @returns {Promise<Object>} Film créé
   * @throws {Error} Si les champs requis sont manquants
   */
  async createMovie(movieData) {
    const { title, description, year, image, genres, duration, director, rating } = movieData;

    if (!title || !description || !year || !director) {
      throw new Error('Required fields: title, description, year, director');
    }

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new Error('At least one genre is required');
    }

    // Obtenir ou créer les genres
    const genreIds = await genreService.getOrCreateGenres(genres);

    return await prisma.movie.create({
      data: {
        title,
        description,
        year: parseInt(year),
        image,
        duration: duration ? parseInt(duration) : 0,
        director,
        rating: rating ? parseFloat(rating) : 0,
        genres: {
          create: genreIds.map(genreId => ({
            genreId
          }))
        }
      },
      include: {
        genres: {
          include: {
            genre: true
          }
        }
      }
    });
  }

  /**
   * Mettre à jour un film existant
   * @param {number} id - ID film
   * @param {Object} movieData - Données du film à mettre à jour
   * @returns {Promise<Object>} Updated movie
   * @throws {Error} If movie not found
   */
  async updateMovie(id, movieData) {
    const { title, description, year, image, genres, duration, director, rating } = movieData;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (year) updateData.year = parseInt(year);
    if (image !== undefined) updateData.image = image;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (director) updateData.director = director;
    if (rating !== undefined) updateData.rating = parseFloat(rating);

    try {
      // Si des genres sont fournis, les mettre à jour
      if (genres && Array.isArray(genres) && genres.length > 0) {
        // Supprimer les relations de genres existantes
        await prisma.movieGenre.deleteMany({
          where: { movieId: parseInt(id) }
        });

        // Obtenir ou créer les nouveaux genres
        const genreIds = await genreService.getOrCreateGenres(genres);

        // Créer les nouvelles relations
        updateData.genres = {
          create: genreIds.map(genreId => ({
            genreId
          }))
        };
      }

      return await prisma.movie.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          genres: {
            include: {
              genre: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Movie not found');
      }
      throw error;
    }
  }

  /**
   * Supprimer un film
   * @param {number} id - ID film
   * @returns {Promise<Object>} Film supprimé
   * @throws {Error} Si le film n'est pas trouvé
   */
  async deleteMovie(id) {
    try {
      return await prisma.movie.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Movie not found');
      }
      throw error;
    }
  }
}

module.exports = new MovieService();
