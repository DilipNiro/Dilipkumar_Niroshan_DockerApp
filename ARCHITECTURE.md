# Schéma d'Architecture - Application de Gestion de Films

## Vue d'ensemble

Ce document présente l'architecture technique de l'application déployée avec Docker Compose.

## Architecture des Conteneurs

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         HÔTE (Docker Host)                                   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │  
│  │                    RÉSEAU DOCKER (app-network)                         │  │
│  │                         Driver: bridge                                 │  │
│  │                                                                        │  │
│  │  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────┐  │  │
│  │  │   FRONTEND       │      │    BACKEND       │      │  POSTGRESQL  │  │  │
│  │  │                  │      │                  │      │              │  │  │
│  │  │ Container:       │      │ Container:       │      │ Container:   │  │  │
│  │  │ movie-app-       │ HTTP │ movie-app-       │ SQL  │ movie-app-   │  │  │
│  │  │ frontend         │─────▶│ backend          │─────▶│ postgres     │  │  │
│  │  │                  │      │                  │      │              │  │  │
│  │  │ Image:           │      │ Image:           │      │ Image:       │  │  │
│  │  │ nginx:alpine     │      │ node:20-alpine   │      │ postgres:    │  │  │
│  │  │                  │      │                  │      │ 13-alpine    │  │  │
│  │  │ Port interne: 80 │      │ Port interne:    │      │ Port: 5432   │  │  │
│  │  │ Port exposé: 80  │      │ 3000             │      │ Port exposé: │  │  │
│  │  │                  │      │ Port exposé:3000 │      │ 5432         │  │  │
│  │  │ User: nginx      │      │                  │      │              │  │  │
│  │  │ (non-root)       │      │ User: nodejs     │      │ User:        │  │  │
│  │  │                  │      │ (uid: 1001)      │      │ postgres     │  │  │
│  │  │ Healthcheck:     │      │                  │      │              │  │  │
│  │  │ /health          │      │ Healthcheck:     │      │ Healthcheck: │  │  │
│  │  │                  │      │ /api/health      │      │ pg_isready   │  │  │
│  │  └──────────────────┘      └──────────────────┘      └──────────────┘  │  │
│  │         │                          │                          │        │  │
│  │         │                          │                          │        │  │
│  │         └──────────────────────────┴──────────────────────────┘        │  │
│  │                          Réseau interne                                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                    VOLUME PERSISTANT                                  │   │
│  │                                                                       │   │
│  │  Volume: postgres_data                                                │   │
│  │  Driver: local                                                        │   │
│  │  Mount: /var/lib/postgresql/data                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │  │  Données persistantes:                                          │  │   │
│  │  │  - Tables (Users, Movies, Genres, WatchlistItems)               │  │   │
│  │  │  - Indexes                                                      │  │   │
│  │  │  - Migrations Prisma                                            │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Flux de données

### 1. Requête utilisateur → Frontend

```
Utilisateur (Navigateur)
    │
    │ HTTP GET/POST
    ▼
┌─────────────────┐
│   Frontend      │
│   (Nginx)       │
│   Port: 80      │
└─────────────────┘
    │
    │ Sert les fichiers statiques React
    │ (index.html, JS, CSS)
    ▼
Réponse HTML/JS/CSS
```

### 2. Requête API → Backend → Base de données

```
Frontend (React App)
    │
    │ HTTP Request
    │ GET /api/movies
    │ Headers: Authorization: Bearer <token>
    ▼
┌─────────────────┐
│   Backend       │
│   (Express)     │
│   Port: 3000    │
│                 │
│   Middleware:   │
│   - CORS        │
│   - Auth (JWT)  │
│   - Validation  │
└─────────────────┘
    │
    │ Prisma ORM
    │ SQL Query
    ▼
┌─────────────────┐
│   PostgreSQL    │
│   Port: 5432    │
│                 │
│   Database:     │
│   - Users       │
│   - Movies      │
│   - Genres      │
│   - Watchlist   │
└─────────────────┘
    │
    │ SQL Response
    ▼
Backend (JSON Response)
    │
    │ HTTP Response
    ▼
Frontend (React State Update)
```

## Détails des services

### Frontend Container

```
┌─────────────────────────────────────────┐
│  Frontend Container (nginx:alpine)      │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Nginx Server                     │  │
│  │  - Port: 80                       │  │
│  │  - Config: nginx.conf             │  │
│  │  - User: nginx (non-root)         │  │
│  └───────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Static Files                     │  │
│  │  /usr/share/nginx/html/           │  │
│  │  - index.html                     │  │
│  │  - assets/ (JS, CSS)              │  │
│  │  - images/                        │  │
│  └───────────────────────────────────┘  │ 
│                                         │
│  Build Process:                         │
│  1. npm ci (dependencies)               │
│  2. npm run build (Vite)                │
│  3. Copy dist/ to nginx                 │
└─────────────────────────────────────────┘
```

### Backend Container

```
┌─────────────────────────────────────────┐
│  Backend Container (node:20-alpine)     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Node.js Runtime                  │  │ 
│  │  - User: nodejs (uid: 1001)       │  │
│  │  - Entry: src/server.js           │  │
│  └───────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Express Application              │  │
│  │  - Routes: /api/*                 │  │
│  │  - Middleware: CORS, Auth, etc.   │  │
│  └───────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Prisma Client                    │  │
│  │  - ORM Layer                      │  │
│  │  - Generated Client               │  │
│  └───────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Database Connection              │  │
│  │  - PostgreSQL                     │  │
│  │  - Connection Pool                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Build Process:                         │
│  1. npm ci (production deps)            │
│  2. npx prisma generate                 │
│  3. Copy source files                   │
│  4. Run migrations on startup           │
└─────────────────────────────────────────┘
```

### PostgreSQL Container

```
┌─────────────────────────────────────────┐
│  PostgreSQL Container (postgres:13)     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  PostgreSQL Server                │  │
│  │  - Port: 5432                     │  │
│  │  - User: postgres                 │  │
│  │  - Database: myapp                │  │
│  └───────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Data Directory                   │  │
│  │  /var/lib/postgresql/data         │  │
│  │  (Mounted from volume)            │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Volume: postgres_data                  │
│  - Persists across container restarts   │
│  - Survives container deletion          │
└─────────────────────────────────────────┘
```

## Flux d'authentification

```
1. Requête de connexion
   ┌─────────────┐
   │   Frontend  │ POST /api/auth/login
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Backend   │ Vérifier les identifiants
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │  PostgreSQL │ Requête table utilisateurs
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Backend   │ Générer le token JWT
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Frontend  │ Stocker le token dans localStorage
   └─────────────┘

2. Requête authentifiée
   ┌─────────────┐
   │   Frontend  │ GET /api/movies
   │             │ En-tête: Authorization: Bearer <token>
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Backend   │ Vérifier le token JWT
   │   (Auth     │ Extraire les infos utilisateur
   │   Middleware)│
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Backend   │ Traiter la requête
   │   (Controller)│
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │  PostgreSQL │ Exécuter la requête
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │   Frontend  │ Recevoir les données et mettre à jour l'UI
   └─────────────┘
```

## Ports et Expositions

```
┌─────────────────────────────────────────────────────────┐
│                    Hôte (Host Machine)                  │
│                                                         │
│  Port 80  ───┐                                          │
│              │                                          │
│  Port 3000 ──┼─────────┐                                │
│              │         │                                │
│  Port 5432 ──┼─────────┼─────────────┐                  │
│              │         │             │                  │
│              ▼         ▼             ▼                  │
│   ┌─────────────┐  ┌──────────┐  ┌──────────┐           │
│   │  Frontend   │  │ Backend  │  │ Postgres │           │
│   │  :80        │  │ :3000    │  │ :5432    │           │
│   └─────────────┘  └──────────┘  └──────────┘           │
│                                                         │
│  Note: Les ports peuvent être personnalisés via .env    │
└─────────────────────────────────────────────────────────┘
```

## Sécurité et Isolation

```
┌─────────────────────────────────────────────────────────┐
│                    Isolation des Services               │
│                                                         │
│  ┌──────────────┐                                       │
│  │   Frontend   │  User: nginx (non-root)               │
│  │              │  Network: app-network                 │
│  │              │  Read-only: false                     │
│  └──────────────┘                                       │
│                                                         │
│  ┌──────────────┐                                       │
│  │   Backend    │  User: nodejs (uid: 1001, non-root)   │
│  │              │  Network: app-network                 │
│  │              │  Read-only: false                     │
│  └──────────────┘                                       │
│                                                         │
│  ┌──────────────┐                                       │
│  │  PostgreSQL  │  User: postgres                       │
│  │              │  Network: app-network                 │
│  │              │  Volume: postgres_data (persistent)   │
│  └──────────────┘                                       │
│                                                         │
│  Communication:                                         │
│  - Frontend ↔ Backend: HTTP (port 3000)                 │
│  - Backend ↔ PostgreSQL: PostgreSQL protocol (port 5432)│
│  - Pas d'accès direct Frontend → PostgreSQL             │
└─────────────────────────────────────────────────────────┘
```

## Cycle de vie des données

```
1. Démarrage
   ┌───────────────────┐
   │ docker-compose up │
   └──────┬────────────┘
          │
          ├─► Build images (si nécessaire)
          ├─► Create network (app-network)
          ├─► Create volume (postgres_data)
          ├─► Start PostgreSQL
          ├─► Wait for PostgreSQL healthcheck
          ├─► Start Backend
          │   └─► Run Prisma migrations
          └─► Start Frontend

2. Requête utilisateur
   User → Frontend → Backend → PostgreSQL → Backend → Frontend → User

3. Arrêt
   ┌─────────────────────┐
   │ docker-compose down │
   └──────┬──────────────┘
          │
          ├─► Stop Frontend
          ├─► Stop Backend
          ├─► Stop PostgreSQL
          └─► Volume postgres_data PERSISTE (données sauvegardées)

4. Redémarrage
   ┌───────────────────┐
   │ docker-compose up │
   └──────┬────────────┘
          │
          └─► Volume postgres_data est réutilisé
              └─► Données toujours présentes
```

## Technologies utilisées

| Service | Technologie | Version | Rôle |
|---------|-----------|---------|------|
| Frontend | React | 19.2.0 | Interface utilisateur |
| Frontend | Vite | 7.2.4 | Build tool |
| Frontend | Nginx | Alpine | Serveur web |
| Backend | Node.js | 20 | Runtime JavaScript |
| Backend | Express | 5.2.1 | Framework web |
| Backend | Prisma | 5.22.0 | ORM |
| Database | PostgreSQL | 13 | Base de données |
| Container | Docker | 20.10+ | Conteneurisation |
| Orchestration | Docker Compose | 1.29+ | Orchestration |

---


