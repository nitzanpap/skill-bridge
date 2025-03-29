# Skill Bridge

## Description

🎯 Skill Bridge is a recommendation engine that identifies skill gaps between job seekers and job requirements, then suggests targeted upskilling courses to improve job match scores. By bridging the gap between user skills and job requirements, we help candidates become more competitive for their desired positions.

## Features

- 📄 **Skill Extraction**: Automatically extract required skills from job descriptions using NER (Named Entity Recognition)
- 👤 **Profile Analysis**: Process user profiles to identify existing skills and competencies
- 📚 **Job Matching**: Match users to relevant jobs based on skill compatibility using various metrics
- 🔍 **Gap Analysis**: Quantify and visualize skill gaps between candidates and job requirements
- 🧠 **Semantic Matching**: Compare skills semantically using state-of-the-art sentence transformers (e.g., "ML" matches with "Machine Learning")
- 🎯 **Match Scoring**: Calculate an overall match score between resume and job description to help candidates assess their fit
- 📘 **Course Recommendations**: Suggest the most relevant courses to acquire missing skills with potential score improvement metrics

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React framework)
- **UI Libraries**: 
  - Tailwind CSS for styling
  - Shadcn UI for component library
  - Lucide React for icons
- **Language**: TypeScript
- **State Management**: React Context API
- **API Integration**: Fetch API
- **Build Tools**: Node.js 18+, npm/yarn/pnpm
- **Containerization**: Docker for containerized deployment

### Backend
- **Framework**: FastAPI (Python web framework)
- **Machine Learning**:
  - spaCy for NER models
  - sentence-transformers for semantic matching
  - scikit-learn for similarity metrics
- **Language**: Python 3.10+
- **Containerization**: Docker
- **API Documentation**: Swagger UI / ReDoc (auto-generated)
- **Dependency Management**: uv (faster and more reliable than pip)
- **Development Tools**:
  - Black for code formatting
  - Flake8 for linting
  - mypy for type checking

### Development Environment
- **Version Control**: Git
- **Node Version Management**: nvm for managing Node.js versions
- **Python Version Management**: pyenv (optional) for managing Python versions
- **Environment Management**: Python virtual environments and .env files
- **Container Orchestration**: Docker for consistent development and deployment environments

## Core Components

- Advanced NER pipeline for skill identification
- Semantic matching using sentence transformers
- Comprehensive evaluation tools and metrics
- Course recommendation engine with score improvement calculations
- Modern, responsive UI with light/dark mode support

## Installation & Setup

### Prerequisites

- Docker (for containerized deployment)
- Node.js and npm (if running frontend locally)
- Python 3.10+ (if running backend locally)
- **Supported Platforms**: Linux or Windows with WSL (Windows Subsystem for Linux)

> **Note for Windows Users**: The backend server is designed to run on Linux-based systems. If you're using Windows, we recommend using Windows Subsystem for Linux (WSL) to run the backend. The frontend can run directly on Windows.

#### Installing WSL (for Windows users)

1. Open PowerShell as Administrator and run:
   ```powershell
   wsl --install
   ```
   This installs Ubuntu by default.

2. Restart your computer when prompted.

3. After restart, a terminal will open automatically. Create your Linux username and password.

4. Update your Linux distribution:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

5. You can now access your WSL environment anytime by typing `wsl` in the command prompt or using the Windows Terminal.

#### Installing Docker

Docker allows you to run applications in containers, making setup much easier:

1. Download and install Docker Desktop from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Follow the installation wizard instructions for your operating system
3. After installation, start Docker Desktop
4. Verify installation by running `docker --version` in your terminal/command prompt

#### Installing Node.js using NVM (recommended)

NVM (Node Version Manager) helps you manage multiple Node.js versions:

**For macOS/Linux:**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Reload your terminal profile
source ~/.bashrc  # or ~/.zshrc if using zsh

# Verify NVM installation
nvm --version

# Install Node.js 18
nvm install 18

# Use Node.js 18
nvm use 18

# Verify Node.js installation
node --version
npm --version
```

**For Windows:**
1. Install NVM for Windows from [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Download and run the nvm-setup.exe file
3. Open a new Command Prompt and run:
```cmd
nvm install 18
nvm use 18
node --version
npm --version
```

#### Installing Python (if running backend locally)

**For macOS/Linux:**
```bash
# Install pyenv (Python version manager)
curl https://pyenv.run | bash

# Add to your shell profile
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc  # or ~/.zshrc if using zsh

# Install Python 3.10
pyenv install 3.10

# Set global Python version
pyenv global 3.10

# Verify installation
python --version
```

**For Windows:**
1. Download Python 3.10 installer from [python.org](https://www.python.org/downloads/)
2. Run the installer and check "Add Python to PATH"
3. Verify installation by opening Command Prompt and running `python --version`

### Setup Options

You can run the application using Docker (recommended) or run components locally.

#### Option 1: Using Docker (Recommended)

### Backend

```bash
# Clone the repository (if not done already)
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge

# Build and run the backend with Docker
cd backend
docker build -t skillbridge-backend .
docker run -p 8000:8000 skillbridge-backend
```

The API will be available at http://localhost:8000 with documentation at http://localhost:8000/docs

Note: The backend uses `uv` for Python dependency management.

### Frontend

```bash
# Navigate to the client directory
cd client

# Build and run the frontend with Docker
docker build -t skillbridge-frontend .
docker run -p 3000:3000 skillbridge-frontend
```

The application will be available at http://localhost:3000

#### Option 2: Running Locally

See the README files in the backend and client directories for detailed instructions on running components locally.

## Usage

The application provides a simple web interface where you can:

1. Paste your resume text
2. Paste a job description
3. Adjust the similarity threshold for matching
4. Get a comprehensive analysis including:
   - Overall match score
   - Matched skills
   - Missing skills 
   - Detailed similarity breakdown for each skill
   - Course recommendations to bridge your skill gap
   - Score improvement predictions for each recommended course

## Technical Architecture

- **Backend**: FastAPI server with spaCy NER models and sentence-transformers for semantic similarity
- **Frontend**: Next.js application with React, Tailwind CSS, and Shadcn UI components
- **API**: RESTful endpoints for skill extraction, comparison, and course recommendations

## Impact

This project directly addresses workforce development challenges by:

- Providing clear pathways for career advancement through targeted course recommendations
- Optimizing training and education investments by focusing on high-impact skills
- Reducing skill mismatches in the job market
- Empowering users with actionable insights for professional development
- Quantifying potential improvements in job match scores through recommended courses
