# Fase 1: Build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./
RUN npm ci

COPY . .
RUN npm run build

# Fase 2: Production
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./
# Instala solo dependencias de producción
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Se usa el script transpilado
CMD ["node", "dist/main.js"]
