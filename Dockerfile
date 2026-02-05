# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --frozen-lockfile

# Copy source code
COPY src ./src
COPY tsconfig.json next.config.ts postcss.config.mjs ./
COPY public ./public
COPY components.json ./

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (standalone output)
RUN npm run build

# Runtime stage - minimal image
FROM node:22-alpine AS runner

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache dumb-init su-exec shadow

# Set environment
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/media-tracker.db"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# PUID/PGID for user mapping (like linuxserver.io)
ENV PUID=1000
ENV PGID=1000

# Copy standalone build output (includes traced app dependencies)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema, migrations, and CLI for migrate deploy
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/valibot ./node_modules/valibot
COPY --from=builder /app/node_modules/pathe ./node_modules/pathe
COPY prisma.config.ts ./

# Copy package.json for version display
COPY package.json ./

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Create directories for runtime
RUN mkdir -p /app/data /app/logs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
