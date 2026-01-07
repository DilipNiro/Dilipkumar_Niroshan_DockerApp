const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Démarrage du seed...');

  // Créer l'utilisateur admin
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', {
    id: admin.id,
    email: admin.email,
    role: admin.role
  });

  // Créer des films d'exemple avec leurs genres
  const moviesData = [
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      year: 2010,
      genres: ['Science Fiction', 'Action', 'Thriller'],
      duration: 148,
      director: 'Christopher Nolan',
      rating: 8.8,
      image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    },
    {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      year: 2008,
      genres: ['Action', 'Crime', 'Drama'],
      duration: 152,
      director: 'Christopher Nolan',
      rating: 9.0,
      image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      year: 2014,
      genres: ['Science Fiction', 'Drama', 'Adventure'],
      duration: 169,
      director: 'Christopher Nolan',
      rating: 8.6,
      image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    },
    {
      title: 'The Matrix',
      description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      year: 1999,
      genres: ['Science Fiction', 'Action'],
      duration: 136,
      director: 'The Wachowskis',
      rating: 8.7,
      image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
    },
    {
      title: 'Pulp Fiction',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      year: 1994,
      genres: ['Crime', 'Drama'],
      duration: 154,
      director: 'Quentin Tarantino',
      rating: 8.9,
      image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
    }
  ];

  // Vérifier si les films existent déjà
  const existingMoviesCount = await prisma.movie.count();

  if (existingMoviesCount === 0) {
    for (const movieData of moviesData) {
      const { genres, ...movieInfo } = movieData;
      
      // Obtenir ou créer les genres
      const genreIds = [];
      for (const genreName of genres) {
        const genre = await prisma.genre.upsert({
          where: { name: genreName },
          update: {},
          create: { name: genreName }
        });
        genreIds.push(genre.id);
      }

      // Créer le film avec ses genres
      await prisma.movie.create({
        data: {
          ...movieInfo,
          genres: {
            create: genreIds.map(genreId => ({
              genreId
            }))
          }
        }
      });
    }
    console.log(`Created ${moviesData.length} sample movies with genres`);
  } else {
    console.log('Movies already exist, skipping movie creation');
  }

  // Créer un utilisateur de test
  const userPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Test user created:', {
    id: user.id,
    email: user.email,
    role: user.role
  });

  console.log('\n✅ Seed completed successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('User: user@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
