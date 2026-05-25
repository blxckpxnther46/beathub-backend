# Multi-Stage Build for BeatHub Backend
# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --only=production

# Stage 2: Runner
FROM node:18-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

# Copy package files from builder
COPY --from=builder --chown=appuser:appuser /app/package*.json ./

# Copy node_modules from builder
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000', (r) => {if (r.statusCode !== 404) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "index.js"]
