/**
 * Middleware de validation des entrées
 */

/**
 * Valider les données d'inscription
 */
const validateSignup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

/**
 * Valider les données de film
 */
const validateMovie = (req, res, next) => {
  const { title, year, rating, duration } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (year && (year < 1800 || year > new Date().getFullYear() + 5)) {
    return res.status(400).json({ error: 'Invalid year' });
  }

  if (rating !== undefined && (rating < 0 || rating > 10)) {
    return res.status(400).json({ error: 'Rating must be between 0 and 10' });
  }

  if (duration !== undefined && duration <= 0) {
    return res.status(400).json({ error: 'Duration must be positive' });
  }

  next();
};

/**
 * Valider le statut de la watchlist
 */
const validateWatchlistStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['WATCHLIST', 'WATCHING', 'COMPLETED'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      validStatuses
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateMovie,
  validateWatchlistStatus
};
