#!/bin/bash

# Exit on error
set -e

echo "Starting SkillBridge backend server..."

# Activate virtual environment
source .venv/bin/activate

# Start the server
echo "Server starting at http://localhost:8000"
echo "API documentation available at http://localhost:8000/docs"
python -m app.main 
