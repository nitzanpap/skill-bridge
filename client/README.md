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

## Requirements

- Node.js 18.x or later
- npm 9.x or later (or equivalent yarn/pnpm)
- Modern browser with ES6+ support

## Quick Start

### Prerequisites

Before installation, ensure you have Node.js and npm (or yarn/pnpm) installed:

```bash
# Check your Node.js version
node --version  # Should be 18.x or higher

# Check your npm version
npm --version   # Should be 9.x or higher
```

### Installation

1. Clone the repository and navigate to the client directory:

```bash
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge/client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure the environment:

Create a `.env.local` file in the root of the client directory with the following content:

```
NEXT_PUBLIC_API_URL='http://localhost:8000'
```

This assumes your backend is running at http://localhost:8000. Adjust as needed.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Then you can start the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
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
