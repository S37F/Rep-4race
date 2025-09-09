# Overview

This is a web-based multiplayer chit-passing game built with React, TailwindCSS, and shadcn/ui. The game supports up to 4 players who pass chits (cards) clockwise in turns, aiming to collect 4 chits of the same category to win. The application features real-time multiplayer functionality with join codes, smooth animations, and a comprehensive UI for game management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: TailwindCSS for utility-first styling with custom design system variables
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth chit passing animations and UI transitions
- **State Management**: Zustand stores for game state, multiplayer state, and audio management
- **Build Tool**: Vite for fast development and optimized production builds
- **Query Management**: TanStack React Query for server state management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with placeholder routes for game operations
- **Development**: Hot module replacement via Vite middleware integration
- **Static Serving**: Express serves built React application in production

## Game Logic Architecture
- **Game State**: Centralized store managing players, chits, turns, and game phases
- **Turn System**: Turn-based mechanics with automatic progression and win detection
- **Chit System**: 16 total chits across 4 categories (Fruits, Cars, Animals, Colors)
- **Win Detection**: Automatic checking for matching category collections
- **Ranking System**: Manual rank claiming for 2nd-4th place after winner determination

## Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with migrations
- **Development Storage**: In-memory storage implementation for local development
- **Schema**: Basic user table structure prepared for authentication
- **Environment**: Database URL configuration for production deployment

## Authentication and Authorization
- **Current State**: Basic user schema defined but not implemented
- **Planned**: Username/password authentication with session management
- **Storage**: User credentials and session data in PostgreSQL

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting service via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database toolkit with migration support

## Real-time Communication
- **Supabase**: Real-time multiplayer synchronization and game state management
- **Mock Service**: Development fallback using in-memory storage with subscription simulation

## UI and Animation Libraries
- **Radix UI**: Headless component primitives for accessibility and behavior
- **Framer Motion**: Animation library for chit passing and UI state transitions
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for component variant management

## Development Tools
- **Vite**: Build tool with React plugin and GLSL shader support
- **PostCSS**: CSS processing with TailwindCSS and Autoprefixer
- **TypeScript**: Type checking and compile-time error detection
- **ESBuild**: Fast bundling for production server builds

## Font and Styling
- **Inter Font**: Primary typeface loaded from Fontsource
- **TailwindCSS**: Utility-first CSS framework with custom design tokens
- **CSS Variables**: HSL-based color system for light/dark theme support