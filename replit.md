# TutorMatch Platform

## Overview

TutorMatch is a fully functional full-stack web application that connects students with tutors. The platform allows students to browse and search for tutors by subject, location, and other criteria, while enabling tutors to create comprehensive profiles. The application features a complete authentication system, tutor discovery with advanced filtering, and messaging functionality between students and tutors to facilitate communication and lesson booking.

## Recent Changes (January 28, 2025)

✓ Built complete tutoring platform with full functionality
✓ Implemented user authentication with role-based access (student/tutor)
✓ Created comprehensive tutor profile system with ratings and reviews
✓ Added advanced search and filtering by subject, location, and price range
✓ Built messaging system for student-tutor communication
✓ Fixed query client to properly handle search parameters
✓ Added responsive design with professional UI using shadcn/ui components
✓ Populated with sample tutor data for immediate functionality
✓ **Migrated from memory storage to PostgreSQL database with Neon**
✓ **Implemented complete database schema with relations using Drizzle ORM**
✓ **Added DatabaseStorage class replacing MemStorage for persistent data**

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context for authentication, TanStack Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Development Server**: Custom Vite integration for SSR-like development experience

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for serverless database connections

## Key Components

### Authentication System
- JWT-less session management using simple user validation
- User registration with role selection (student/tutor)
- Login/logout functionality with persistent authentication state
- Context-based authentication state management across the application

### User Management
- User profiles with customizable avatars
- Role-based access (students vs tutors)
- Profile creation and management for both user types

### Tutor System
- Comprehensive tutor profiles with experience, education, and specializations
- Subject categorization and filtering
- Hourly rate setting and location preferences
- Rating and review system integration
- Availability scheduling

### Messaging System
- Direct messaging between students and tutors
- Conversation threading
- Message read status tracking
- Real-time messaging interface

### Search and Discovery
- Advanced tutor search with multiple filters (subject, location, rate range)
- Subject categorization with visual icons
- Featured tutor listings
- Geographic location-based matching

## Data Flow

1. **User Registration/Login**: Client → Auth API → Database → Context State
2. **Tutor Discovery**: Client → Search API → Database → Filtered Results
3. **Profile Management**: Client → Profile API → Database → Updated State
4. **Messaging**: Client → Message API → Database → Real-time Updates
5. **Tutor Profiles**: Client → Tutor API → Database → Profile Data

The application follows a traditional request-response pattern with optimistic updates handled by TanStack Query for improved user experience.

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Data Management
- TanStack Query for server state management and caching
- React Hook Form with Zod validation for form handling
- Date-fns for date manipulation and formatting

### Development Tools
- ESBuild for fast production builds
- PostCSS with Autoprefixer for CSS processing
- TypeScript for type safety across the entire stack

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for rapid development
- Custom middleware integration for API routes
- Replit-specific tooling for cloud development

### Production Build
- Client assets built with Vite and output to `dist/public`
- Server code bundled with ESBuild for Node.js execution
- Static file serving integrated with Express
- Environment-based configuration for database connections

### Database Management
- Schema defined in shared TypeScript files with complete relations
- Migrations managed through Drizzle Kit using `npm run db:push`
- **PostgreSQL database with Neon serverless for persistent storage**
- Connection pooling handled by Neon serverless driver
- DatabaseStorage class provides full CRUD operations with type safety

The application is structured as a monorepo with shared schema definitions, allowing for type safety between client and server. The development experience is optimized for Replit with integrated debugging and hot reload capabilities.