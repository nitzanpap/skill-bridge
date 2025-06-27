FROM python:3.10-slim

# Set working directory
WORKDIR /app

# install uv.
# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download the latest installer
ADD https://astral.sh/uv/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

# Copy requirements file
COPY pyproject.toml .

ENV PATH="/root/.local/bin/:$PATH"

# Install dependencies in a specific order to avoid binary compatibility issues
# First install numpy with a compatible version
RUN pip install numpy==1.24.3
# Then install spacy with exact version
RUN pip install spacy==3.7.2
# Then install the rest of the dependencies
RUN uv sync

# Copy application code
COPY . .

# Expose port 8000 as a default
# The actual port used will be determined by the application reading from .env
EXPOSE 8000

# Command to run the application
# Let the application use the PORT from .env through config.py
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
