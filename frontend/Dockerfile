# Étape 1 : Dépendances
FROM node:20-alpine AS deps
WORKDIR /app

# Installer les dépendances uniquement si nécessaire
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Étape 2 : Build
FROM node:20-alpine AS builder
WORKDIR /app

# Arguments de build pour les variables d'environnement
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

# Copier les dépendances
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construire l'application
RUN npm run build

# Étape 3 : Production
FROM nginx:alpine AS runner

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers compilés
COPY --from=builder /app/dist /usr/share/nginx/html

# Créer un utilisateur non-root (nginx s'exécute déjà en non-root dans alpine)
# Ajouter la vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

# Exposer le port
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]

