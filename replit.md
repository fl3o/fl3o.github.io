# Ratio Master Calculator

## Overview

Ratio Master is a French-language web application for calculating, tracking, and optimizing upload/download ratios. It's a utility-focused dashboard tool that helps users monitor their sharing statistics, set ratio goals, and receive personalized recommendations for improvement. The application features data visualization with charts, historical tracking, and goal-oriented calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Charts**: Recharts for data visualization (line charts, bar charts, area charts)
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES modules)
- **API Pattern**: RESTful JSON API under /api/* routes
- **Development**: Vite middleware for HMR in development
- **Production**: Static file serving from dist/public

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Validation**: Zod schemas with drizzle-zod integration
- **Current Storage**: In-memory storage (MemStorage class) as default implementation
- **Database Ready**: PostgreSQL schema defined, requires DATABASE_URL environment variable

### Data Models
- **Users**: id, username, password (authentication ready but not implemented)
- **RatioEntries**: id, upload (real), download (real), ratio (real), recordedAt (timestamp)

### API Endpoints
- `GET /api/entries` - Fetch all ratio entries
- `GET /api/entries/:id` - Fetch single entry
- `POST /api/entries` - Create new entry
- `DELETE /api/entries/:id` - Delete entry

### Design System
- Material Design-inspired data dashboard approach
- Elevated cards with shadows for data display
- Color-coded status indicators (emerald=excellent, green=good, amber=warning, red=critical)
- Responsive grid layout (3-column desktop, 2-column tablet, single mobile)
- Dark/light theme toggle with system preference detection

## External Dependencies

### Database
- **PostgreSQL**: Primary database (Drizzle ORM configured)
- **Drizzle Kit**: Database migrations in ./migrations folder
- Push command: `npm run db:push`

### UI Libraries
- **Radix UI**: Full suite of accessible primitives (dialogs, dropdowns, tabs, etc.)
- **Recharts**: Data visualization library
- **Embla Carousel**: Carousel functionality
- **date-fns**: Date formatting with French locale support

### Development Tools
- **Vite**: Development server and bundler
- **esbuild**: Production server bundling
- **@replit/vite-plugin-***: Replit-specific development plugins

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver integration
- **zod**: Schema validation

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Class merging utilities