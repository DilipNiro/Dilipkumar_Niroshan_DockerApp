# Étape 1 : Dépendances
FROM node:20-alpine AS deps
WORKDIR /app

# Installer uniquement les dépendances de production
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Étape 2 : Build (Génération Prisma)
FROM node:20-alpine AS builder
WORKDIR /app

# Installer OpenSSL et autres dépendances pour Prisma
RUN apk add --no-cache openssl libc6-compat

# Copier les fichiers de configuration
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (y compris les dépendances de dev pour Prisma)
RUN npm ci && npm cache clean --force

# Générer le client Prisma
RUN npx prisma generate

# Étape 3 : Production
FROM node:20-alpine AS runner
WORKDIR /app

# Installer OpenSSL pour l'exécution de Prisma
RUN apk add --no-cache openssl libc6-compat

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copier les fichiers nécessaires
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs prisma ./prisma
COPY --chown=nodejs:nodejs src ./src

# Passer à l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 3000

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrer l'application
CMD ["node", "src/server.js"]

