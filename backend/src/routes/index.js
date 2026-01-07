const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const watchlistRoutes = require('./watchlistRoutes');
const genreRoutes = require('./genreRoutes');

// Point de terminaison de vérification de santé
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateurs
router.use('/users', userRoutes);

// Routes films
router.use('/movies', movieRoutes);

// Routes watchlist
router.use('/watchlist', watchlistRoutes);

// Routes genres
router.use('/genres', genreRoutes);

module.exports = router;
