# Project Structure

## Overview

This document provides a comprehensive overview of the Second Opinion application's project structure. Understanding this structure is essential for developers to navigate the codebase efficiently and maintain consistency in development practices.

## Root Directory Structure

The project is organized into three main directories:

```
Second-Opinion/
├── client/         # Frontend Next.js application
├── docs/           # Project documentation
└── server/         # Backend server code
```

## Client Application Structure

The client application is built with Next.js using the App Router pattern:

```
client/
├── public/         # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/            # Source code
│   ├── app/        # Next.js App Router pages
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   └── components/ # Reusable UI components
├── .gitignore
├── README.md
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
└── postcss.config.mjs
```

## App Directory Structure

The `src/app` directory follows Next.js App Router conventions:

```
src/app/
├── (auth)/             # Auth route group
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── forgot-password/ # Password recovery
│   └── verify-email/   # Email verification
├── favicon.ico         # Site favicon
├── globals.css         # Global styles
├── layout.js           # Root layout component
└── page.js             # Home page component
```

## Components Directory Structure

The `src/components` directory is organized by functionality (planned structure):

```
src/components/
├── common/         # Shared components
├── layout/         # Layout components
├── ui/             # Basic UI components
├── auth/           # Authentication components
├── forms/          # Form-related components
└── [feature]/      # Feature-specific components
```

## Documentation Structure

The project documentation is organized in the `docs` directory:

```
docs/
├── README.md           # Documentation overview
├── project-structure.md # This document
├── home-pages.md       # Home pages documentation
├── other-pages.md      # Other pages documentation
├── auth-pages.md       # Auth pages documentation
└── components.md       # Components documentation
```

## Server Structure

The server directory contains backend code (structure to be developed):

```
server/
├── src/            # Source code
├── config/         # Configuration files
├── controllers/    # Request handlers
├── models/         # Data models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── tests/          # Test files
```

## Development Workflow

When working on the Second Opinion project, developers should:

1. Understand the overall project structure
2. Follow the established patterns for creating new pages and components
3. Maintain separation of concerns between client and server code
4. Update documentation when making significant structural changes

## Best Practices

- Keep components small and focused on a single responsibility
- Use consistent naming conventions throughout the project
- Follow the established directory structure when adding new files
- Maintain documentation alongside code changes
- Use TypeScript for type safety when possible
- Write tests for new functionality