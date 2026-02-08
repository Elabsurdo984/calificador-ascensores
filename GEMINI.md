# Calificador de Ascensores

## Project Overview

**Calificador de Ascensores** is a full-stack application designed to rate, track, and compare elevators globally. It allows users to record elevator metrics (speed, smoothness, design, capacity), calculate scores, and view rankings.

The project is structured as a monorepo containing:
- **Backend**: A Node.js/TypeScript application following **Hexagonal Architecture**.
- **Frontend**: A React application built with Vite and Tailwind CSS.

## Key Technologies

- **Backend**: Node.js, TypeScript, Express.js
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Recharts
- **Persistence**: Local JSON file storage
- **Linting/Formatting**: ESLint (Frontend)

## Project Structure

```
calificador-ascensores/
├── src/                    # Backend Source Code (Hexagonal Architecture)
│   ├── api/                # REST API Layer (Express)
│   │   ├── middleware/     # API Middleware (Error handling, logging)
│   │   ├── routes/         # Route definitions
│   │   └── server.ts       # Server entry point
│   ├── core/               # Application Core / Business Logic
│   ├── domain/             # Domain Entities and Types
│   └── infra/              # Infrastructure (Repositories, Persistence)
├── web/                    # Frontend Application (React)
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── services/       # API Clients / Services
│   │   └── types/          # Frontend Types
│   ├── package.json
│   └── vite.config.ts
├── data/                   # Data storage directory (Git ignored)
├── package.json            # Root package configuration
├── tsconfig.json           # Root TypeScript configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Backend Setup

The backend runs on port `3001` by default.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the API (Development Mode):**
    ```bash
    npm run api:dev
    ```
    - API Health Check: `http://localhost:3001/api/health`
    - Elevators Endpoint: `http://localhost:3001/api/elevators`

3.  **Run Example Scripts:**
    - Without persistence: `npm run dev`
    - With persistence: `npm run dev:persist`

### Frontend Setup

The frontend runs on `http://localhost:5173` by default.

1.  **Navigate to the web directory:**
    ```bash
    cd web
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start Development Server:**
    ```bash
    npm run dev
    ```

## Development Conventions

- **Architecture**: The backend strictly follows Hexagonal Architecture.
    - **Domain**: Pure business logic and entities. No external dependencies.
    - **Core**: Application services implementing use cases.
    - **Infra**: Implementation of interfaces (repositories, external services).
    - **API**: Presentation layer (REST).
- **Persistence**: Currently uses a local JSON file (`data/elevators.json`).
- **Styling**: The frontend uses Tailwind CSS for styling.
- **State Management**: React hooks and local state are primarily used.
- **Type Safety**: Strict TypeScript usage across both backend and frontend. Shared types should be kept in sync manually or through a shared package (future improvement).

## Key Files

- **Backend Entry**: `src/api/server.ts`
- **Backend Routes**: `src/api/routes/elevatorRoutes.ts`
- **Frontend Entry**: `web/src/main.tsx`
- **Frontend App Component**: `web/src/App.tsx`
- **Elevator Domain Model**: `src/domain/Elevator.ts`
- **JSON Repository**: `src/infra/repositories/JsonElevatorRepository.ts`
