# Multi-stage Docker build for fullstack NestJS + React application
# Mehrstufiger Docker-Build für Fullstack-NestJS + React-Anwendung

# ============================================================
# Stage 1: Build React frontend
# Stufe 1: React-Frontend erstellen
# ============================================================
FROM node:24-alpine AS frontend-builder

# Set working directory for frontend
# Arbeitsverzeichnis für Frontend festlegen
WORKDIR /app/frontend

# Copy frontend package files
# Frontend-Paketdateien kopieren
COPY frontend/package*.json ./

# Install frontend dependencies
# Frontend-Abhängigkeiten installieren
RUN npm ci

# Copy frontend source code
# Frontend-Quellcode kopieren
COPY frontend/ ./

# Build React app for production
# React-App für Produktion erstellen
RUN npm run build

# ============================================================
# Stage 2: Build NestJS backend
# Stufe 2: NestJS-Backend erstellen
# ============================================================
FROM node:24-alpine AS backend-builder

# Set working directory
# Arbeitsverzeichnis festlegen
WORKDIR /app

# Copy backend package files
# Backend-Paketdateien kopieren
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
# Alle Abhängigkeiten installieren (einschließlich Dev-Abhängigkeiten für Build)
RUN npm ci

# Copy backend source code
# Backend-Quellcode kopieren
COPY . .

# Copy built frontend from Stage 1
# Erstelltes Frontend aus Stufe 1 kopieren
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Build the NestJS application
# NestJS-Anwendung erstellen
RUN npm run build

# ============================================================
# Stage 3: Production image
# Stufe 3: Produktions-Image
# ============================================================
FROM node:24-alpine

# Set working directory
# Arbeitsverzeichnis festlegen
WORKDIR /app

# Copy package files
# Paketdateien kopieren
COPY package*.json ./

# Install only production dependencies
# Nur Produktions-Abhängigkeiten installieren
RUN npm ci --only=production

# Copy built backend from Stage 2
# Erstelltes Backend aus Stufe 2 kopieren
COPY --from=backend-builder /app/dist ./dist

# Copy built frontend from Stage 2
# Erstelltes Frontend aus Stufe 2 kopieren
COPY --from=backend-builder /app/frontend/dist ./frontend/dist

# Expose port 3000
# Port 3000 freigeben
EXPOSE 3000

# Start the application
# Anwendung starten
CMD ["node", "dist/main"]
