# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Install system dependencies for build
RUN apk add --no-cache python3 make g++ openssl libssl3

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies with retry logic and increased timeout
RUN npm ci --legacy-peer-deps \
    --fetch-timeout=600000 \
    --fetch-retries=5 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 || \
    npm ci --legacy-peer-deps \
    --fetch-timeout=600000 \
    --fetch-retries=5 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY tsconfig*.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 2: Runner (production)
FROM node:22-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libssl3

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install ONLY production dependencies with retry
RUN npm ci --omit=dev \
    --fetch-timeout=600000 \
    --fetch-retries=5 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 && \
    npm cache clean --force

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Expose the port your app runs on
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Run migrations and start app
CMD npx prisma migrate deploy && node dist/src/main.js
