const authService = require('../services/authService');

class AuthController {
  /**
   * Inscription d'un utilisateur
   * @route POST /api/auth/signup
   */
  async signup(req, res) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.signup({ email, password, name });

      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error during signup',
        details: error.message
      });
    }
  }

  /**
   * Connexion utilisateur
   * @route POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login({ email, password });

      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error during login',
        details: error.message
      });
    }
  }

  /**
   * Obtenir le profil de l'utilisateur actuel
   * @route GET /api/auth/me
   * @middleware auth
   */
  async getCurrentUser(req, res) {
    try {
      // req.user est défini par le middleware auth
      const user = await authService.getUserById(req.user.id);

      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Error fetching user',
        details: error.message
      });
    }
  }
}

module.exports = new AuthController();
