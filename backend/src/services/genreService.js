const prisma = require('../config/database');

class GenreService {
  /**
   * Obtenir tous les genres
   * @returns {Promise<Array>} Liste des genres
   */
  async getAllGenres() {
    return await prisma.genre.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Obtenir ou créer des genres par noms
   * @param {Array<string>} genreNames - Tableau des noms de genres
   * @returns {Promise<Array>} Tableau des IDs de genres
   */
  async getOrCreateGenres(genreNames) {
    if (!genreNames || !Array.isArray(genreNames) || genreNames.length === 0) {
      return [];
    }

    const genres = [];
    for (const name of genreNames) {
      if (!name || typeof name !== 'string') continue;
      
      const genre = await prisma.genre.upsert({
        where: { name: name.trim() },
        update: {},
        create: { name: name.trim() }
      });
      genres.push(genre.id);
    }

    return genres;
  }

  /**
   * Créer un nouveau genre
   * @param {string} name - Nom du genre
   * @returns {Promise<Object>} Genre créé
   */
  async createGenre(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Genre name is required');
    }

    return await prisma.genre.create({
      data: { name: name.trim() }
    });
  }
}

module.exports = new GenreService();

