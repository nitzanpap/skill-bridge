FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install uv system-wide
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

ADD https://astral.sh/uv/install.sh /uv-installer.sh
ENV UV_INSTALL_DIR="/usr/local/bin"
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Copy requirements file
COPY pyproject.toml .

# Install dependencies in a specific order to avoid binary compatibility issues
# First install numpy with a compatible version
RUN pip install numpy==1.24.3
# Then install spacy with exact version
RUN pip install spacy==3.7.2
# Then install the rest of the dependencies
RUN uv sync

# Copy application code
COPY . .

# Run as non-root user
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser:appuser /app
USER appuser

# Expose port PORT, or 8000 as a default
EXPOSE ${PORT:-8000}

# Command to run the application
CMD ["sh", "-c", "uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
