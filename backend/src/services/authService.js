const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthService {
  /**
   * Générer un token JWT pour l'utilisateur
   * @param {Object} user - Objet utilisateur
   * @returns {string} Token JWT
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Enregistrer un nouvel utilisateur
   * @param {Object} userData - {email, password, name}
   * @returns {Promise<Object>} {user, token}
   * @throws {Error} Si l'email existe déjà
   */
  async signup(userData) {
    const { email, password, name } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Créer l'utilisateur avec le rôle USER par défaut
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    // Générer le token
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Connexion utilisateur
   * @param {Object} credentials - {email, password}
   * @returns {Promise<Object>} {user, token}
   * @throws {Error} Si les identifiants sont invalides
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Trouver l'utilisateur avec le mot de passe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Retirer le mot de passe de l'objet utilisateur
    const { password: _, ...userWithoutPassword } = user;

    // Générer le token
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  /**
   * Obtenir un utilisateur par ID (depuis le token)
   * @param {number} userId - ID utilisateur
   * @returns {Promise<Object>} Utilisateur sans mot de passe
   * @throws {Error} Si l'utilisateur n'est pas trouvé
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = new AuthService();
