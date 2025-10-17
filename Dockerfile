# =========================
# Stage 1: Dependencies
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies separately for caching
COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# =========================
# Stage 2: Builder
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy cached dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_API_URL_IMG
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Expose them to the build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_API_URL_IMG=$NEXT_PUBLIC_API_URL_IMG
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Build Next.js app
RUN npm run build

# =========================
# Stage 3: Runner
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Copy only essential runtime files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

# Reduce image size (optional)
RUN rm -rf node_modules/.cache && npm prune --omit=dev

# Expose and run
EXPOSE 8080
CMD ["npm", "start"]
