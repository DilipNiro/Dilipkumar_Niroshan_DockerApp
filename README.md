# 🎬 Application Web de Gestion de Films

[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-1.29+-blue.svg)](https://docs.docker.com/compose/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)

Application web full-stack pour la gestion d'un catalogue de films avec système d'authentification, watchlist et administration. Déployée avec Docker Compose.

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [Services](#-services)
- [Sécurité](#-sécurité)
- [Dépannage](#-dépannage)
- [Contribution](#-contribution)
- [Licence](#-licence)

## 🎯 À propos

Ce projet est une application web complète permettant de :
- 📽️ Parcourir un catalogue de films
- ⭐ Gérer une watchlist personnalisée
- 👤 S'authentifier et gérer son profil
- 🔐 Accéder à un panneau d'administration (pour les admins)
- 🐳 Déployer facilement avec Docker Compose

> 📐 **Architecture détaillée** : Pour comprendre l'architecture complète du projet avec tous les schémas et détails techniques, consultez le fichier [ARCHITECTURE.md](./ARCHITECTURE.md)

## ✨ Fonctionnalités

### Pour tous les utilisateurs
- 🔍 Recherche de films par titre, réalisateur, genre
- 📊 Filtrage par genre et année
- ⭐ Système de notation
- 📝 Watchlist personnalisée avec statuts (À voir, En cours, Terminé)
- 👤 Authentification sécurisée (JWT)

### Pour les administrateurs
- ➕ Ajout, modification et suppression de films
- 📋 Gestion du catalogue
- 👥 Consultation de la liste des utilisateurs
- 📊 Tableau de bord avec statistiques

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker** : version 20.10 ou supérieure
- **Docker Compose** : version 1.29 ou supérieure (ou Docker Compose V2)
- **Git** : pour cloner le dépôt

### Vérification de l'installation

```bash
docker --version
docker-compose --version
# ou pour Docker Compose V2
docker compose version
git --version
```

### Systèmes d'exploitation supportés

- ✅ Linux
- ✅ macOS (avec Docker Desktop)
- ✅ Windows (avec Docker Desktop)

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/DilipNiro/Dilipkumar_Niroshan_DockerApp.git
cd Dilipkumar_Niroshan_DockerApp
```

### 2. Créer le fichier d'environnement (Optionnel mais recommandé)

> 💡 **Note** : Le projet peut fonctionner sans fichier `.env` car le `docker-compose.yml` utilise des valeurs par défaut. Cependant, il est **fortement recommandé** de créer un fichier `.env` pour personnaliser la configuration, surtout pour le `JWT_SECRET` en production.

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Puis éditez le fichier `.env` avec vos valeurs (optionnel) :

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=myapp
POSTGRES_PORT=5432

# Backend Configuration
BACKEND_PORT=3000
JWT_SECRET=votre-cle-secrete-minimum-32-caracteres-changez-en-production
JWT_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_PORT=80
VITE_API_URL=http://localhost:3000/api
```

> ⚠️ **Important** : Changez absolument le `JWT_SECRET` en production avec une clé sécurisée d'au moins 32 caractères. Vous pouvez générer une clé avec :
> ```bash
> openssl rand -base64 32
> ```

### 3. Construire et lancer les conteneurs

```bash
# Construire les images et démarrer tous les services
docker-compose up -d --build
```

Cette commande va :
- ✅ Construire les images Docker pour le frontend et le backend
- ✅ Télécharger l'image PostgreSQL
- ✅ Créer le réseau Docker
- ✅ Créer le volume persistant pour la base de données
- ✅ Initialiser la base de données avec le schéma Prisma
- ✅ **Remplir automatiquement la base avec des données de test** (seed)
- ✅ Démarrer tous les services

### 4. Vérifier que tout fonctionne

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Vérifier les logs
docker-compose logs -f
```

Vous devriez voir les 3 conteneurs en cours d'exécution :
- `movie-app-postgres` (healthy)
- `movie-app-backend` (healthy)
- `movie-app-frontend` (healthy)

### 5. Accéder à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:3000/api
- **Health Check Backend** : http://localhost:3000/api/health
- **Health Check Frontend** : http://localhost/health

### 6. Données de test créées automatiquement

Lors du premier démarrage, la base de données est automatiquement remplie avec des données de test :

#### 👤 Comptes utilisateurs

- **Administrateur** :
  - Email : `admin@example.com`
  - Mot de passe : `admin123`
  - Rôle : ADMIN (accès au panneau d'administration)

- **Utilisateur test** :
  - Email : `user@example.com`
  - Mot de passe : `password123`
  - Rôle : USER

#### 🎬 Films d'exemple

5 films sont créés avec leurs genres associés :
- **Inception** (2010) - Science Fiction, Action, Thriller
- **The Dark Knight** (2008) - Action, Crime, Drama
- **Interstellar** (2014) - Science Fiction, Drama, Adventure
- **The Matrix** (1999) - Science Fiction, Action
- **Pulp Fiction** (1994) - Crime, Drama

> 💡 **Note** : Le seed s'exécute automatiquement au démarrage. Si vous souhaitez réinitialiser les données, vous pouvez exécuter manuellement :
> ```bash
> docker-compose exec backend npm run prisma:seed
> ```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `POSTGRES_USER` | Utilisateur PostgreSQL | `postgres` | Non |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `postgres` | Non |
| `POSTGRES_DB` | Nom de la base de données | `myapp` | Non |
| `POSTGRES_PORT` | Port PostgreSQL (host) | `5432` | Non |
| `BACKEND_PORT` | Port API backend (host) | `3000` | Non |
| `FRONTEND_PORT` | Port frontend (host) | `80` | Non |
| `JWT_SECRET` | Clé secrète pour JWT | - | **Oui** (à changer) |
| `JWT_EXPIRES_IN` | Durée de validité du token | `7d` | Non |
| `VITE_API_URL` | URL de l'API pour le frontend | `http://localhost:3000/api` | Non |

### Ports utilisés

Par défaut, les ports suivants sont utilisés :

- **Frontend** : `80` → http://localhost
- **Backend API** : `3000` → http://localhost:3000/api
- **PostgreSQL** : `5432` → localhost:5432

> 💡 **Note** : Si ces ports sont déjà utilisés sur votre machine, modifiez-les dans le fichier `.env`.

## 📖 Utilisation

### Commandes Docker Compose utiles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Voir les logs
docker-compose logs -f [service_name]

# Redémarrer un service
docker-compose restart [service_name]

# Reconstruire un service
docker-compose up -d --build [service_name]

# Exécuter une commande dans un conteneur
docker-compose exec [service_name] [command]

# Voir l'état des services
docker-compose ps
```

### Commandes spécifiques

```bash
# Initialiser la base de données (si nécessaire)
docker-compose exec backend npx prisma db push

# Remplir/réinitialiser la base avec des données de test
# Note: Le seed s'exécute automatiquement au démarrage, mais vous pouvez le relancer manuellement
docker-compose exec backend npm run prisma:seed

# Accéder à Prisma Studio (interface graphique pour la BDD)
docker-compose exec backend npx prisma studio
# Puis ouvrez http://localhost:5555 dans votre navigateur

# Accéder à la base de données PostgreSQL
docker-compose exec postgres psql -U postgres -d myapp
```

### Créer un compte administrateur supplémentaire

> 💡 **Note** : Un compte administrateur est déjà créé automatiquement : `admin@example.com` / `admin123`

Si vous souhaitez créer un autre compte administrateur :

1. Créez d'abord un compte normal via l'interface web
2. Connectez-vous à la base de données :
   ```bash
   docker-compose exec postgres psql -U postgres -d myapp
   ```
3. Mettez à jour le rôle de l'utilisateur :
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'votre-email@example.com';
   ```

## 🏗️ Architecture

L'application est composée de **3 conteneurs** qui communiquent via un réseau Docker :

```
┌─────────────────────────────────────────────────────────────┐
│                    Réseau Docker (bridge)                   │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐       ┌──────────┐  │
│  │   Frontend   │─────▶│   Backend    │──────▶│ Postgres │  │
│  │  (Nginx)     │ HTTP │  (Node.js)   │ SQL   │          │  │
│  │  Port: 80    │      │  Port: 3000  │       │ Port:5432│  │
│  └──────────────┘      └──────────────┘       └──────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Volume persistant: postgres_data               │ │
│  │         (Persistance des données de la BDD)            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

> 📐 **Documentation complète** : Pour une documentation détaillée de l'architecture avec tous les schémas (flux de données, authentification, détails des conteneurs, sécurité, etc.), consultez le fichier [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📦 Services

### Frontend (React + Vite)

- **Image de base** : `nginx:alpine`
- **Port** : 80 (configurable)
- **Build** : Multi-stage avec optimisation
- **Healthcheck** : `/health`

### Backend (Node.js + Express)

- **Image de base** : `node:20-alpine`
- **Port** : 3000 (configurable)
- **Base de données** : Prisma ORM avec PostgreSQL
- **Healthcheck** : `/api/health`
- **Utilisateur** : Non-root (uid 1001)

### PostgreSQL

- **Image** : `postgres:13-alpine`
- **Port** : 5432 (configurable)
- **Volume** : `postgres_data` (persistance)
- **Healthcheck** : `pg_isready`

## 🔒 Sécurité

### Mesures de sécurité implémentées

1. ✅ **Utilisateur non-root** : Le backend s'exécute avec un utilisateur non-privilégié (uid 1001)
2. ✅ **Images Alpine** : Utilisation d'images légères et minimales
3. ✅ **Multi-stage builds** : Réduction de la taille des images finales
4. ✅ **.dockerignore** : Exclusion des fichiers sensibles et node_modules
5. ✅ **Healthchecks** : Surveillance de l'état des services
6. ✅ **Réseau isolé** : Communication via un réseau Docker dédié
7. ✅ **Variables d'environnement** : Secrets non hardcodés dans le code
8. ✅ **JWT sécurisé** : Authentification par tokens



## 💾 Sauvegarde et Restauration

### Sauvegarde de la base de données

```bash
# Créer une sauvegarde
docker-compose exec postgres pg_dump -U postgres myapp > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde compressée
docker-compose exec postgres pg_dump -U postgres myapp | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restauration

```bash
# Restaurer depuis un fichier SQL
docker-compose exec -T postgres psql -U postgres myapp < backup.sql

# Restaurer depuis un fichier compressé
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U postgres myapp
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier l'état
docker-compose ps

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Vérifier les logs PostgreSQL
docker-compose logs postgres

# Tester la connexion
docker-compose exec backend npx prisma db pull
```

### Le frontend ne peut pas joindre le backend

Vérifiez que :
- Le backend est démarré : `docker-compose ps backend`
- Les deux services sont sur le même réseau
- La variable `VITE_API_URL` est correctement configurée

### Erreur Prisma / OpenSSL

Si vous rencontrez des erreurs Prisma, assurez-vous que les dépendances OpenSSL sont installées (déjà incluses dans le Dockerfile).

### Réinitialiser complètement

```bash
# ⚠️ ATTENTION : Cela supprime toutes les données
docker-compose down -v
docker-compose rm -f
docker-compose up -d --build
```

### Problèmes de permissions

```bash
# Vérifier les permissions des fichiers
ls -la backend/
ls -la frontend/

# Si nécessaire, ajuster les permissions
chmod -R 755 backend/ frontend/
```

### Ports déjà utilisés

Si vous obtenez une erreur `bind: address already in use` :

```bash
# Trouver le processus utilisant le port
lsof -i:3000  # pour le backend
lsof -i:80    # pour le frontend
lsof -i:5432  # pour PostgreSQL

# Arrêter le processus ou changer le port dans .env
```

## 📊 Choix techniques

### Pourquoi Alpine Linux ?

- ✅ Images légères (réduction de la taille de ~70%)
- ✅ Moins de vulnérabilités (surface d'attaque réduite)
- ✅ Démarrage plus rapide

### Pourquoi Multi-stage builds ?

- ✅ Réduction de la taille des images finales
- ✅ Séparation des dépendances de build et de production
- ✅ Meilleure sécurité (pas de dev dependencies en production)

### Pourquoi Nginx pour le frontend ?

- ✅ Serveur web performant et léger
- ✅ Support natif du routing SPA
- ✅ Compression gzip intégrée
- ✅ Cache des assets statiques

### Pourquoi un réseau Docker dédié ?

- ✅ Isolation des services
- ✅ Communication sécurisée entre conteneurs
- ✅ Pas besoin d'exposer tous les ports

## 🧪 Tests

### Tests manuels

```bash
# Tester le healthcheck du backend
curl http://localhost:3000/api/health

# Tester le healthcheck du frontend
curl http://localhost/health

# Tester l'API des films
curl http://localhost:3000/api/movies
```

## 📝 Notes de développement

Pour le développement local avec hot-reload, utilisez `docker-compose.dev.yml` :

```bash
docker-compose -f docker-compose.dev.yml up
```

## 👥 Auteur

**Dilipkumar Niroshan** - 

