#!/bin/sh
# Script d'initialisation de la base de données
# Ce script est exécuté automatiquement par docker-compose

echo "Attente de la disponibilité de PostgreSQL..."
until pg_isready -h postgres -U postgres; do
  sleep 1
done

echo "PostgreSQL est prêt !"
echo "Exécution des migrations Prisma..."
npx prisma migrate deploy

echo "Génération du client Prisma..."
npx prisma generate

echo "Initialisation de la base de données terminée !"

