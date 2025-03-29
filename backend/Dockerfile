FROM python:3.10-slim

# Set working directory
WORKDIR /app

# install uv.
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Copy requirements file
COPY pyproject.toml .
COPY uv.lock .

# Install dependencies
RUN uv sync

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["./run.sh"] 
