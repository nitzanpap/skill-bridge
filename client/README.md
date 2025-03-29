# SkillBridge Frontend

A modern web application for the SkillBridge platform. This client application provides an intuitive interface for resume analysis, job requirement matching, skill gap identification, and course recommendations using semantic matching technology.

## Features

- Resume and job description text input
- Semantic skill matching with adjustable similarity threshold
- Comprehensive match score calculation
- Detailed skill comparison visualization
- Course recommendations based on identified skill gaps
- Score improvement predictions for each recommended course
- Modern, responsive UI with light/dark mode support

## Tech Stack

- **Framework**: Next.js 14+ (React 18+)
- **UI/UX**:
  - Tailwind CSS 3.x for utility-first styling
  - Shadcn UI for accessible, customizable component library
  - Lucide React for scalable vector icons
  - CSS Variables for theming (light/dark mode)
- **Language**: TypeScript 5.x
- **State Management**: React Context API and Hooks
- **API Communication**: Fetch API with custom wrapper
- **Build & Development**:
  - Node.js 18+ runtime
  - npm/yarn/pnpm package management
  - ESLint for code quality
  - Prettier for code formatting
- **Deployment**:
  - Docker for containerization
  - Vercel/Netlify for production hosting (optional)

## Requirements

- Node.js 18.x or later
- npm 9.x or later (or equivalent yarn/pnpm)
- Docker (for containerized deployment)
- Modern browser with ES6+ support

## Quick Start

### Prerequisites

- Docker (for containerized deployment)
- Node.js 18+ and npm (for local development)

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

### Setup Options

#### Option 1: Docker Setup (Recommended)

Build and run the client application using Docker:

```bash
# Build a Docker image (first create a Dockerfile in the client directory if not present)
docker build -t skillbridge-frontend .

# Run the container
docker run -p 3000:3000 skillbridge-frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

Note: Make sure the backend is also running with Docker as described in the main README.

#### Option 2: Local Development Setup

1. Clone the repository and navigate to the client directory:

```bash
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge/client
```

2. Install dependencies:

```bash
# Install dependencies using npm
npm install

# Or, if you prefer yarn
yarn install

# Or, if you prefer pnpm
pnpm install
```

3. Configure environment variables:

Create a `.env.local` file in the client directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This assumes your backend is running at http://localhost:8000. Adjust if needed.

4. Start the development server:

```bash
# Start the development server
npm run dev

# Or, if using yarn
yarn dev

# Or, if using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

5. For a production build:

```bash
# Create a production build
npm run build

# Start the production server
npm start
```

## Usage

The application provides a simple interface to:

1. Input your resume text
2. Input a job description text
3. Adjust the similarity threshold for matching (lower values match more skills with weaker similarities)
4. Submit for analysis

The results will display:

- An overall match score between your resume and the job description
- A list of matched skills
- A list of missing skills
- Detailed matching information showing the similarity between each job skill and your closest matching skill
- Personalized course recommendations to help bridge identified skill gaps
- Predicted score improvements for each recommended course
- Direct links to course platforms

## Project Structure

```
client/
├── app/                     # Next.js app directory
│   ├── components/          # Reusable UI components
│   │   ├── comparison-results.tsx   # Skill comparison results display
│   │   ├── course-recommendations.tsx # Course recommendation display
│   │   ├── text-input.tsx  # Text input components
│   │   └── theme-toggle.tsx # Theme switcher component
│   ├── page.tsx            # Main application page
│   └── layout.tsx          # Root layout component
├── components/             # Shared UI components
│   └── ui/                 # Shadcn UI components
├── lib/                    # Utility functions and API client
│   ├── api.ts              # API client for backend communication
│   └── utils.ts            # Helper functions
├── styles/                 # Global styles
├── public/                 # Static assets
├── next.config.mjs         # Next.js configuration
└── package.json            # Project dependencies
```

## API Integration

The frontend communicates with the backend through a RESTful API. The main endpoints used are:

- `POST /api/v1/compare-skills/semantic`: Compares resume skills against job requirements using semantic matching
- `POST /api/v1/recommend-courses`: Gets course recommendations based on identified skill gaps

See the `api.ts` file for implementation details.

## Theming

The application supports both light and dark modes through a theme toggle in the top right corner. Themes are implemented using CSS variables and persistent storage to remember user preferences.

## Technologies Used

- Next.js for the React framework
- Tailwind CSS for styling
- Shadcn UI for component library
- TypeScript for type safety

## Troubleshooting

### Common Issues and Solutions

#### Docker Issues

1. **Docker container fails to start**:
   ```
   Error: Couldn't connect to Docker daemon
   ```
   - Make sure Docker Desktop is running
   - Try running Docker Desktop as administrator/with sudo

2. **Port already in use**:
   ```
   Error: Bind for 0.0.0.0:3000 failed: port is already allocated
   ```
   - Another application is using port 3000
   - Change the port when running Docker: `docker run -p 3001:3000 skillbridge-frontend`
   - Then access the application at http://localhost:3001

3. **Container exits immediately**:
   - Check logs with `docker logs [container_id]`
   - Ensure your Dockerfile has the correct CMD command

#### Node.js and npm Issues

1. **Module not found errors**:
   ```
   Error: Cannot find module 'next'
   ```
   - Ensure dependencies are installed: `npm install`
   - Delete node_modules folder and package-lock.json, then run `npm install` again

2. **NVM not recognized**:
   - Make sure NVM is installed and properly set up in your PATH
   - Restart your terminal/command prompt after installation

3. **Port conflicts with development server**:
   - Change the port with: `npm run dev -- -p 3001`
   - Or, for other package managers:
     - Yarn: `yarn dev -p 3001`
     - pnpm: `pnpm dev -p 3001`

#### API Connection Issues

1. **Cannot connect to backend API**:
   - Ensure backend server is running
   - Check your .env.local file has the correct NEXT_PUBLIC_API_URL value
   - Verify network connectivity between frontend and backend

### Getting Help

If you encounter issues not covered here, check:
1. The project's GitHub issues section
2. Next.js documentation: https://nextjs.org/docs
3. Docker documentation: https://docs.docker.com/
4. Node.js documentation: https://nodejs.org/en/docs/
