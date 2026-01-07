const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateGenres() {
  console.log('Starting genre migration...');

  try {
    // Get all movies with the old genre field (if it still exists in DB)
    // Since we're using Prisma, we need to use raw SQL to check for the old column
    const movies = await prisma.$queryRaw`
      SELECT id, title, genre 
      FROM "Movie" 
      WHERE genre IS NOT NULL
    `.catch(() => {
      // If the column doesn't exist, return empty array
      return [];
    });

    if (movies.length === 0) {
      console.log('No movies with old genre format found. Migration not needed.');
      return;
    }

    console.log(`Found ${movies.length} movies to migrate`);

    for (const movie of movies) {
      if (!movie.genre) continue;

      // Get or create genre
      const genre = await prisma.genre.upsert({
        where: { name: movie.genre },
        update: {},
        create: { name: movie.genre }
      });

      // Create MovieGenre relation if it doesn't exist
      await prisma.movieGenre.upsert({
        where: {
          movieId_genreId: {
            movieId: movie.id,
            genreId: genre.id
          }
        },
        update: {},
        create: {
          movieId: movie.id,
          genreId: genre.id
        }
      });

      console.log(`Migrated: ${movie.title} -> ${movie.genre}`);
    }

    console.log('✅ Genre migration completed!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateGenres();

