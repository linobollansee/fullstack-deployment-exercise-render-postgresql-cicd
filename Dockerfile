# Stage 1: Build React frontend
FROM node:24-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build React app for production
RUN npm run build

# Stage 2: Build NestJS backend
FROM node:24-alpine AS backend-builder

# Set working directory
WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy backend source code
COPY . .

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Build the NestJS application
RUN npm run build

# Stage 3: Production image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built backend from Stage 2
COPY --from=backend-builder /app/dist ./dist

# Copy built frontend from Stage 2
COPY --from=backend-builder /app/frontend/dist ./frontend/dist

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
