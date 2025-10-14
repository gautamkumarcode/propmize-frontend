# =========================
# Stage 1: Build
# =========================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files including next.config.js
COPY . .

# Build the Next.js app
RUN npm run build

# =========================
# Stage 2: Production
# =========================
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built Next.js app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy next.config.js to ensure custom config is included
COPY --from=builder /app/next.config.js ./next.config.js

# Optional: copy .env.production if you use it
# COPY --from=builder /app/.env.production ./

# Expose the port Cloud Run expects
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
