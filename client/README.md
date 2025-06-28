# SkillBridge Frontend

A modern web application for the SkillBridge platform. This client application provides an intuitive
interface for resume analysis, job requirement matching, skill gap identification, and course
recommendations using semantic matching technology.

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
  - Vercel/Netlify for production hosting (optional)

## Requirements

- Docker
- Modern browser with ES6+ support

## Quick Start

### Prerequisites

- Docker (required for deployment)
- **Supported Platforms**: Any platform that can run Docker

> **Note**: The application is designed to run exclusively through Docker to ensure consistent
> environments across development and production.

#### Installing Docker

Docker allows you to run applications in containers, making setup much easier:

1. Download and install Docker Desktop from
   [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Follow the installation wizard instructions for your operating system
3. After installation, start Docker Desktop
4. Verify installation by running `docker --version` in your terminal/command prompt

### Docker Setup (Only Supported Method)

1. Clone the repository and navigate to the client directory:

   ```bash
   git clone https://github.com/yourusername/skill-bridge.git
   cd skill-bridge
   ```

2. Using Docker Compose (recommended):

   ```bash
   # Build and start both frontend and backend
   docker-compose up -d

   # To rebuild containers after making changes
   docker-compose up -d --build
   ```

   The application will be available at <http://localhost:3000>

3. Or to build and run just the frontend:

   ```bash
   # Build the Docker image
   cd client
   docker build -t skillbridge-frontend .

   # Run the Docker container
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8000 skillbridge-frontend
   ```

   Note: When running just the frontend container, you'll need to ensure the backend is accessible
   and add the `--add-host=host.docker.internal:host-gateway` flag on Linux.

## Usage

The application provides a simple interface to:

1. Input your resume text
2. Input a job description text
3. Adjust the similarity threshold for matching (lower values match more skills with weaker
   similarities)
4. Submit for analysis

The results will display:

- An overall match score between your resume and the job description
- A list of matched skills
- A list of missing skills
- Detailed matching information showing the similarity between each job skill and your closest
  matching skill
- Personalized course recommendations to help bridge identified skill gaps
- Predicted score improvements for each recommended course
- Direct links to course platforms

## Project Structure

```sh
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

## Configuration

The application uses environment variables for configuration. Create a `.env.local` file in the
client directory to set up your environment:

```bash
# Primary backend URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backup backend URL (optional)
# Used as fallback if the primary backend fails
NEXT_PUBLIC_BACKUP_API_URL=http://localhost:8001

# Node environment
NODE_ENV=development
```

### Environment Variables

- **`NEXT_PUBLIC_API_URL`**: The primary backend API URL. This is the main endpoint the client will
  try to connect to.
- **`NEXT_PUBLIC_BACKUP_API_URL`**: The backup backend API URL. If the primary backend fails or
  returns a server error (5xx), the client will automatically attempt to use this backup URL.
- **`NODE_ENV`**: The Node.js environment (development, production, local).

### Fallback Mechanism

The client includes an automatic fallback mechanism that:

1. First attempts to connect to the primary backend via Next.js rewrites (keeping URLs hidden)
2. If the primary backend fails with a server error (500+) or is unreachable, automatically switches
   to the backup backend via Next.js backup rewrites
3. All backend URLs remain hidden from the client - users only see your Next.js domain
4. Logs the fallback activity for monitoring and debugging purposes

This ensures high availability and seamless user experience even if one backend instance goes down,
while maintaining URL privacy through Next.js proxy routing.

## API Integration

The frontend communicates with the backend through a RESTful API. The main endpoints used are:

- `POST /api/v1/compare-skills/semantic`: Compares resume skills against job requirements using
  semantic matching
- `POST /api/v1/recommend-courses`: Gets course recommendations based on identified skill gaps

See the `api.ts` file for implementation details.

## Theming

The application supports both light and dark modes through a theme toggle in the top right corner.
Themes are implemented using CSS variables and persistent storage to remember user preferences.

## Technologies Used

- Next.js for the React framework
- Tailwind CSS for styling
- Shadcn UI for component library
- TypeScript for type safety

## Deployment

### Vercel Deployment

The application is optimized for deployment on Vercel. Key considerations:

1. **Function Timeouts**: API routes are configured with appropriate timeouts for Vercel's limits
2. **Environment Variables**: Set your `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BACKUP_API_URL` in
   Vercel's dashboard
3. **Build Configuration**: The `vercel.json` file configures function timeouts and other deployment
   settings

### Environment Setup for Production

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `NEXT_PUBLIC_API_URL`: Your primary backend URL
   - `NEXT_PUBLIC_BACKUP_API_URL`: Your backup backend URL (optional)
   - `NODE_ENV`: `production`

## Troubleshooting

### Common Issues and Solutions

#### Node.js and npm Issues

1. **Module not found errors**:

   ```text
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

2. **Function timeout errors on Vercel deployment**:
   - Vercel has different timeout limits: Free (10s), Pro (60s), Enterprise (900s)
   - Ensure your backend responds within these limits
   - Check `vercel.json` configuration for function timeout settings
   - Consider optimizing backend performance for slower requests

### Getting Help

If you encounter issues not covered here, check:

1. The project's GitHub issues section
2. Next.js documentation: <https://nextjs.org/docs>
3. Node.js documentation: <https://nodejs.org/en/docs/>
