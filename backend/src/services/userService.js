const prisma = require('../config/database');

class UserService {
  /**
   * Obtenir tous les utilisateurs
   * @returns {Promise<Array>} Liste des utilisateurs
   */
  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Obtenir un utilisateur par ID
   * @param {number} id - ID utilisateur
   * @returns {Promise<Object|null>} Objet utilisateur ou null
   */
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
  }

  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Données utilisateur {email, name}
   * @returns {Promise<Object>} Utilisateur créé
   * @throws {Error} Si l'email est manquant ou existe déjà
   */
  async createUser(userData) {
    const { email, name } = userData;

    if (!email) {
      throw new Error('Email is required');
    }

    try {
      return await prisma.user.create({
        data: { email, name }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Mettre à jour un utilisateur existant
   * @param {number} id - ID utilisateur
   * @param {Object} userData - Données utilisateur {email, name}
   * @returns {Promise<Object>} Utilisateur mis à jour
   * @throws {Error} Si l'utilisateur n'est pas trouvé ou l'email existe déjà
   */
  async updateUser(id, userData) {
    const { email, name } = userData;

    try {
      return await prisma.user.update({
        where: { id: parseInt(id) },
        data: { email, name }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Supprimer un utilisateur
   * @param {number} id - ID utilisateur
   * @returns {Promise<Object>} Utilisateur supprimé
   * @throws {Error} Si l'utilisateur n'est pas trouvé
   */
  async deleteUser(id) {
    try {
      return await prisma.user.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw error;
    }
  }
}

module.exports = new UserService();
