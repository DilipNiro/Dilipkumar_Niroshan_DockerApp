const prisma = require('../config/database');

class WatchlistService {
  /**
   * Obtenir la watchlist de l'utilisateur
   * @param {number} userId - ID utilisateur
   * @param {string} status - Filtre de statut optionnel (WATCHLIST, WATCHING, COMPLETED)
   * @returns {Promise<Array>} Liste des éléments de watchlist avec détails des films
   */
  async getUserWatchlist(userId, status = null) {
    const where = { userId };

    if (status) {
      where.status = status;
    }

    return await prisma.watchlistItem.findMany({
      where,
      include: {
        movie: {
          include: {
            genres: {
              include: {
                genre: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Ajouter un film à la watchlist de l'utilisateur
   * @param {number} userId - ID utilisateur
   * @param {number} movieId - ID film
   * @param {string} status - Statut (par défaut: WATCHLIST)
   * @returns {Promise<Object>} Élément de watchlist créé
   * @throws {Error} Si le film n'est pas trouvé ou déjà dans la watchlist
   */
  async addToWatchlist(userId, movieId, status = 'WATCHLIST') {
    // Vérifier si le film existe
    const movie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    try {
      return await prisma.watchlistItem.create({
        data: {
          userId,
          movieId,
          status
        },
        include: {
          movie: {
            include: {
              genres: {
                include: {
                  genre: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Movie already in watchlist');
      }
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'un élément de la watchlist
   * @param {number} itemId - ID élément watchlist
   * @param {number} userId - ID utilisateur (pour vérification de propriété)
   * @param {string} status - Nouveau statut
   * @returns {Promise<Object>} Élément de watchlist mis à jour
   * @throws {Error} Si l'élément n'est pas trouvé ou non autorisé
   */
  async updateStatus(itemId, userId, status) {
    // Vérifier la propriété
    const item = await prisma.watchlistItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      throw new Error('Watchlist item not found');
    }

    if (item.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.watchlistItem.update({
      where: { id: itemId },
      data: { status },
      include: {
        movie: {
          include: {
            genres: {
              include: {
                genre: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Retirer un élément de la watchlist
   * @param {number} itemId - ID élément watchlist
   * @param {number} userId - ID utilisateur (pour vérification de propriété)
   * @returns {Promise<Object>} Élément supprimé
   * @throws {Error} Si l'élément n'est pas trouvé ou non autorisé
   */
  async removeFromWatchlist(itemId, userId) {
    // Vérifier la propriété
    const item = await prisma.watchlistItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      throw new Error('Watchlist item not found');
    }

    if (item.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.watchlistItem.delete({
      where: { id: itemId }
    });
  }

  /**
   * Retirer un film de la watchlist par ID de film
   * @param {number} userId - ID utilisateur
   * @param {number} movieId - ID film
   * @returns {Promise<Object>} Élément supprimé
   * @throws {Error} Si le film n'est pas dans la watchlist
   */
  async removeByMovieId(userId, movieId) {
    const item = await prisma.watchlistItem.findUnique({
      where: {
        userId_movieId: { userId, movieId }
      }
    });

    if (!item) {
      throw new Error('Movie not in watchlist');
    }

    return await prisma.watchlistItem.delete({
      where: {
        userId_movieId: { userId, movieId }
      }
    });
  }
}

module.exports = new WatchlistService();
