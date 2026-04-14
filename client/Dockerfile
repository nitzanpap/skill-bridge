FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Build the Next.js application
RUN bun run build

# Run as non-root user
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser && chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "start"]
