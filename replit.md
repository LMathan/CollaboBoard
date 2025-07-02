# CollaboBoard

## Overview

CollaboBoard is a full-stack web application built as a task management and collaboration platform. The application uses a modern stack with React.js on the frontend, Node.js with Express.js on the backend, and PostgreSQL as the database. The architecture follows a monorepo structure with shared code between client and server, implementing a RESTful API design pattern.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Management**: express-session with PostgreSQL store
- **API Design**: RESTful endpoints with consistent error handling

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Strategy**: Passport.js integration with session-based authentication
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation/update on authentication

### Task Management
- **CRUD Operations**: Full create, read, update, delete functionality for tasks
- **Task States**: Todo, In Progress, Done status tracking
- **User Association**: Tasks are scoped to authenticated users
- **Validation**: Zod schemas for both client and server-side validation

### UI Components
- **Design System**: Custom implementation of shadcn/ui components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built on Radix UI primitives for ARIA compliance
- **Theming**: CSS custom properties for light/dark mode support

## Data Flow

1. **Authentication Flow**:
   - User initiates login through Replit Auth
   - OIDC flow completes, user session created
   - Frontend receives user data via `/api/auth/user`

2. **Task Operations**:
   - Frontend makes API calls to `/api/tasks` endpoints
   - Backend validates authentication middleware
   - Database operations performed through Drizzle ORM
   - Results cached client-side via React Query

3. **Real-time Updates**:
   - React Query handles cache invalidation
   - Optimistic updates for better UX
   - Error handling with toast notifications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection and querying
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database operations
- **passport**: Authentication middleware
- **express-session**: Session management

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized production bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit application identifier
- `ISSUER_URL`: OIDC provider URL

### Production Setup
- Node.js server serves static files and API endpoints
- Database schema must be pushed before first run
- Sessions table created automatically if missing

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.