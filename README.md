This is a web application for personal expense management with
basic functionalities like registering, viewing, editing, and deleting
your expenses.

## How to run the project in a local development environment

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser
to see the result.

## Technical Decisions & Architecture

### Technology Stack

#### Core Framework

- **Next.js 16.0.4** - Chosen for its:
  - Built-in server-side rendering and static generation capabilities
  - App Router for modern routing patterns and layouts
  - Excellent developer experience with hot reload
  - Built-in API routes for backend functionality
  - Strong TypeScript support
- **React 19.2.0** - Latest stable version providing:
  - Modern hooks and component patterns
  - Improved performance with automatic batching
  - Better error handling and debugging capabilities

#### Language & Type Safety

- **TypeScript 5** - Ensures:
  - Type safety across the entire application
  - Better IDE autocompletion and IntelliSense
  - Reduced runtime errors through compile-time checks
  - Improved code maintainability and documentation

#### Styling

- **Tailwind CSS 4** - Selected for:
  - Utility-first approach for rapid UI development
  - Consistent design system without custom CSS overhead
  - Small bundle sizes with automatic purging
  - Excellent mobile-first responsive design patterns
  - v4 specifically for the new PostCSS plugin architecture
- **Shadcn/ui** - Selected for:
  - Copy-paste component approach providing full code ownership and customization
  - Built on Radix UI primitives ensuring WCAG-compliant accessibility
  - Perfect integration with Tailwind CSS for consistent styling
  - Zero runtime overhead - components live directly in your codebase
  - Rich set of components ideal for financial apps (tables, forms, charts, dialogs)
  - TypeScript-first with complete type safety
  - Easy theming system with CSS variables and built-in dark mode support

#### Code Quality

- **ESLint 9** with Next.js config - Provides:
  - Consistent code style across the project
  - Early detection of potential bugs
  - Next.js-specific best practices enforcement
  - Automated code fixing with `lint:fix` script

### Project Architecture

#### Directory Structure

- `/src/app` - Next.js App Router structure:
  - `layout.tsx` - Root layout with shared UI elements
  - `page.tsx` - Main page components
  - `globals.css` - Global styles and Tailwind directives

This structure follows Next.js 13+ conventions for:

- File-based routing
- Colocation of components with their routes
- Server and Client Component separation
- Optimized rendering strategies

### Development Workflow

- `npm run dev` - Local development with hot reload
- `npm run build` - Production build
- `npm run lint` - Code quality checks
