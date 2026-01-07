const userService = require('../services/userService');

class UserController {
  /**
   * Obtenir tous les utilisateurs
   * @route GET /api/users
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching users',
        details: error.message
      });
    }
  }

  /**
   * Obtenir un utilisateur par ID
   * @route GET /api/users/:id
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching user',
        details: error.message
      });
    }
  }

  /**
   * Créer un nouvel utilisateur
   * @route POST /api/users
   */
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'Email is required') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error creating user',
        details: error.message
      });
    }
  }

  /**
   * Mettre à jour un utilisateur existant
   * @route PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error updating user',
        details: error.message
      });
    }
  }

  /**
   * Supprimer un utilisateur
   * @route DELETE /api/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error deleting user',
        details: error.message
      });
    }
  }

  /**
   * Obtenir le profil de l'utilisateur actuel
   * @route GET /api/users/profile
   * @middleware auth
   */
  async getProfile(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching profile',
        details: error.message
      });
    }
  }

  /**
   * Mettre à jour le profil de l'utilisateur actuel
   * @route PUT /api/users/profile
   * @middleware auth
   */
  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const user = await userService.updateUser(req.user.id, { name, email });

      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error updating profile',
        details: error.message
      });
    }
  }
}

module.exports = new UserController();
