# 🏗️ Project Structure & Architecture

## Backend Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── env.ts        # Environment variables
│   │   ├── database.ts   # Prisma client
│   │   └── swagger.ts    # Swagger/OpenAPI docs
│   ├── controllers/      # Route handlers
│   │   ├── authController.ts
│   │   ├── electionController.ts
│   │   ├── positionController.ts
│   │   ├── candidateController.ts
│   │   ├── voteController.ts
│   │   └── index.ts
│   ├── routes/          # API routes
│   │   ├── authRoutes.ts
│   │   ├── electionRoutes.ts
│   │   ├── positionRoutes.ts
│   │   ├── candidateRoutes.ts
│   │   ├── voteRoutes.ts
│   │   └── index.ts
│   ├── services/        # Business logic
│   │   ├── authService.ts
│   │   ├── electionService.ts
│   │   ├── positionService.ts
│   │   ├── candidateService.ts
│   │   ├── voteService.ts
│   │   └── index.ts
│   ├── middleware/      # Express middleware
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   ├── errorHandler.ts
│   │   ├── asyncHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   ├── response.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.ts           # Express app setup
│   └── index.ts         # Server entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed data
│   └── migrations/      # Database migrations
├── tests/               # Test files
│   ├── auth.test.ts
│   ├── election.test.ts
│   └── health.test.ts
├── package.json
├── tsconfig.json
├── Dockerfile
├── .eslintrc.json
└── jest.config.js
```

## Frontend Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── PrivateRoute.tsx
│   ├── pages/          # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useAuth.ts
│   ├── services/       # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── electionService.ts
│   ├── store/          # Zustand stores
│   │   ├── authStore.ts
│   │   └── themeStore.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── styles/         # Global styles
│   │   └── globals.css
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── .eslintrc.json
└── package.json
```

## Architecture Patterns

### Backend
- **MVC Pattern**: Models (Prisma), Views (API responses), Controllers (handlers)
- **Service Layer**: Business logic separated from controllers
- **Middleware**: Authentication, authorization, error handling, rate limiting
- **Error Handling**: Custom error classes for consistent responses
- **Validation**: Zod schemas for input validation

### Frontend
- **Component-based**: Reusable UI components
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query for server state
- **Type Safety**: TypeScript for type checking
- **Styling**: Tailwind CSS for utility-first styling

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
│  - Secure token storage (localStorage)          │
│  - HTTPS enforcement                            │
│  - XSS protection                               │
└──────────────┬──────────────────────────────────┘
               │ HTTPS + JWT
┌──────────────▼──────────────────────────────────┐
│         API Gateway (Express)                    │
│  - CORS validation                              │
│  - Rate limiting                                │
│  - Request logging                              │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│      Middleware Stack                           │
│  - Authentication (JWT verification)           │
│  - Authorization (Role-based)                  │
│  - Input validation (Zod)                      │
│  - Error handling                              │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│      Service Layer                              │
│  - Business logic                              │
│  - Data validation                             │
│  - Vote encryption                             │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│      Database Layer (Prisma)                    │
│  - SQL injection prevention                    │
│  - Transaction management                      │
│  - Data integrity                              │
└─────────────────────────────────────────────────┘
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Elections
- `GET /api/elections` - List all elections
- `GET /api/elections/:id` - Get election details
- `POST /api/elections` - Create election (Admin)
- `PUT /api/elections/:id` - Update election (Admin)
- `DELETE /api/elections/:id` - Delete election (Admin)

### Positions
- `GET /api/positions/election/:electionId` - List positions
- `GET /api/positions/:id` - Get position details
- `POST /api/positions` - Create position (Admin)
- `PUT /api/positions/:id` - Update position (Admin)
- `DELETE /api/positions/:id` - Delete position (Admin)

### Candidates
- `GET /api/candidates/position/:positionId` - List candidates
- `GET /api/candidates/:id` - Get candidate details
- `POST /api/candidates` - Create candidate (Admin)
- `PUT /api/candidates/:id` - Update candidate (Admin)
- `DELETE /api/candidates/:id` - Delete candidate (Admin)

### Votes
- `POST /api/votes` - Cast a vote (Voter)
- `GET /api/votes/:electionId/position/:positionId` - Get position results
- `GET /api/votes/election/:electionId/results` - Get election results

## Data Flow

```
User Action (Frontend)
    ↓
 React Component Handler
    ↓
 API Service Call (Axios)
    ↓
 Request with JWT Token
    ↓
 Express Middleware (Auth, Validation)
    ↓
 Controller Handler
    ↓
 Service Layer (Business Logic)
    ↓
 Prisma ORM Query
    ↓
 PostgreSQL Database
    ↓
 Response JSON
    ↓
 Frontend State Update (Zustand/React Query)
    ↓
 UI Re-render
```
