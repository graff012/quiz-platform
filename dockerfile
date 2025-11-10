# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Install system dependencies for build
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source files
COPY tsconfig*.json ./
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Runner (production)
FROM node:22-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Expose the port your app runs on
EXPOSE 4000

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Run migrations and start app
CMD npx prisma migrate deploy && node dist/main.js
