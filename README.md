# Personal Expenses Management System

A modern, offline-first web application for personal expense management with full CRUD functionality, analytics dashboard, and comprehensive filtering capabilities.

## Features

- 📊 **Dashboard Analytics** - Visual spending insights with charts and statistics
- 💰 **Expense Management** - Create, read, update, and delete expenses
- 🔍 **Advanced Filtering** - Sort and filter expenses by category, date, and amount
- 💾 **Offline-First** - All data stored locally in IndexedDB for instant access
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern UI** - Built with Shadcn components and Tailwind CSS
- ⚡ **Fast Performance** - Optimistic updates and intelligent caching
- 🔒 **Type-Safe** - Full TypeScript implementation with Zod validation

## 🌐 Live Demo

The application is deployed and accessible at: **[personal-expenses-management.vercel.app/](https://personal-expenses-management.vercel.app/)**

Try it out to see all features in action without any setup required!

## About This Project

This project (at least in its initial phase) was built with AI assistance using **Claude Opus 4.5**. The following prompt was used to architect and implement the core functionality:

> You're going to build a personal expenses management system. The system is going to be composed of 3 pages:
>
> - A dashboard with analytics of your expenses.
>
> - A expenses list (in a table) with sorting and filtering capabilities
>
> - A expenses form (used to add a expense or modify an existing one)
>
> The main objective is to allow for a user to add, visualize, edit and delete expenses.
>
>
>
> I need you to propose architectonic decisions for this app taking into account:
>
> - Nextjs + typescript are a must.
>
> - Shadcn + tailwind are a must.
>
> - The code must be clean and scalable
>
> - A state management library could be used
>
> - Proper error and loading handling must be provided

The AI-assisted development approach enabled rapid prototyping while maintaining best practices, clean architecture, and comprehensive type safety throughout the codebase.

### Iterative Development & Enhancements

After the initial MVP was delivered, the project underwent several iterations to improve user experience and functionality. This demonstrates that AI-assisted development isn't just about the initial build—it's also effective for iterative improvements and feature refinements.

#### Dashboard Chart Evolution

One significant enhancement was the transformation of the expense analytics visualization:

**Initial State (MVP):**
- Bar chart displaying monthly expense totals
- Fixed view of the last 6 months
- Limited interactivity

**Iterative Improvements:**
1. **Chart Type Change** - Converted from bar chart to line chart for daily expenses
   - Better suited for displaying more granular time-series data
   - Shows spending patterns within a month more clearly
   - Includes data points for visual clarity and interactivity

2. **Month/Year Selection System**
   - Added dropdown selectors for arbitrary month and year navigation
   - Implemented smart filtering to show only months/years with available data
   - Automatic month adjustment when switching years to prevent empty views

3. **Data Completeness** - Enhanced data processing to show all days in a month
   - Days without expenses display as zero (no gaps in visualization)
   - Complete calendar view for better spending pattern recognition

4. **Backend Updates** - Extended database analytics to support daily aggregation
   - Added `dailyTotals` calculation alongside existing `monthlyTotals`
   - Maintained backward compatibility with existing features

These improvements showcase how the codebase's clean architecture and separation of concerns (data layer, hooks, components) made it easy to implement significant feature changes without requiring major refactoring. The type-safe TypeScript implementation and modular component design enabled confident modifications with minimal risk of introducing bugs.

#### Dashboard Recent Expenses Evolution

Another refinement focused on improving the date display format in the recent expenses widget:

**Initial State (MVP):**
- Date displayed in "MMM dd" format (e.g., "Nov 27")
- Ambiguous for expenses from previous years
- Limited temporal context for older records

**Iterative Improvements:**
1. **Enhanced Date Format** - Expanded date display to include year information
   - Changed from "MMM dd" to "MMM dd, yyyy" format (e.g., "Nov 27, 2025")
   - Provides complete temporal context at a glance
   - Particularly valuable when reviewing historical expenses
   - Maintains compact display while adding clarity

This seemingly small enhancement significantly improves data clarity, especially for users tracking expenses over multiple years. The change demonstrates how attention to UX details can make the application more intuitive and informative without adding complexity.

#### Dashboard Redirect Buttons Evolution

A key usability improvement focused on enhancing navigation from the dashboard to the expenses list:

**Initial State (MVP):**
- Single "Agregar Gasto" (Add Expense) button in dashboard header
- Required users to use sidebar navigation to access the expenses list
- No quick path from dashboard to full expenses view

**Iterative Improvements:**
1. **Added Expenses List Navigation** - Introduced a secondary button for direct access
   - New "Ver Gastos" (View Expenses) button with List icon from lucide-react
   - Links directly to `/expenses` page for instant access to the full expenses table
   - Improves discoverability of the expenses list feature

2. **Visual Hierarchy** - Implemented button variants to establish clear action priority
   - "Ver Gastos" uses `outline` variant for secondary action styling
   - "Agregar Gasto" maintains default/primary variant for emphasis
   - Clear visual distinction helps users understand the primary action (adding expenses) while providing easy access to viewing all expenses

3. **Improved User Flow** - Enhanced navigation patterns throughout the application
   - Users can now navigate directly from dashboard analytics to detailed expense list
   - Reduces clicks needed to move between dashboard overview and data management
   - Creates a more fluid user experience between viewing insights and managing data

This enhancement demonstrates how small UX improvements can significantly reduce friction in user workflows. By providing multiple navigation paths to key features, the application becomes more intuitive and efficient for daily expense management tasks.

#### Expenses List Language Evolution

A comprehensive internationalization improvement focused on adapting the expenses list interface for Spanish-speaking users:

**Initial State (MVP):**
- All user-facing text in English
- Page title: "Expenses"
- Table headers: "Date", "Description", "Category", "Amount"
- Filter placeholder: "Search expenses..."
- Category selector: "All categories"
- Action buttons in English

**Iterative Improvements:**
1. **Expenses Page Translation** - Localized the main expenses list page (`src/app/expenses/page.tsx`)
   - Title changed from "Expenses" to "Gastos"
   - Description updated to "Ver y gestionar tus gastos" (View and manage your expenses)
   - Add button text changed from "Add Expense" to "Agregar Gasto"
   - Error message translated to "Error al cargar los gastos. Por favor, intenta de nuevo."

2. **Filters Component Translation** - Adapted all filtering UI elements (`src/components/expenses/filters.tsx`)
   - Search placeholder updated from "Search expenses..." to "Buscar gastos..."
   - Category selector placeholder changed to "Todas las categorías"
   - "All Categories" option translated to "Todas las Categorías"
   - Clear button text changed from "Clear filters" to "Limpiar filtros"

3. **Table Component Translation** - Localized the expenses table interface (`src/components/expenses/expenses-table.tsx`)
   - Column headers translated: "Fecha", "Descripción", "Categoría", "Monto"
   - Empty state message updated to "No se encontraron gastos"
   - Helper text changed to "Agrega tu primer gasto para comenzar"
   - Maintained consistent translations across loading and interactive states

4. **Code Quality Preservation** - Ensured maintainability during translation
   - All code, comments, and variable names remained in English
   - Type safety and functionality preserved throughout the changes
   - No breaking changes to the underlying logic or component contracts

This localization demonstrates the application's flexibility and commitment to accessibility for Spanish-speaking users. The systematic approach to translation—covering page headers, form inputs, table headers, and user feedback messages—ensures a consistent and natural experience throughout the expenses management workflow. The clean separation between presentation and logic allowed for straightforward internationalization without requiring architectural changes.

#### Expenses List Date Range Evolution

A powerful filtering enhancement focused on enabling users to filter expenses by custom date ranges:

**Initial State (MVP):**
- Basic filtering limited to category and search text
- No temporal filtering capabilities
- Users could only see all expenses or filter by category
- Limited ability to analyze spending within specific time periods

**Iterative Improvements:**
1. **Date Range Picker Component** - Integrated a sophisticated calendar-based selection system
   - Added dual-month calendar view using `react-day-picker` for easy date range selection
   - Implemented popover trigger button showing selected date range or placeholder text
   - Calendar displays two months side-by-side for convenient range selection across month boundaries
   - Used `date-fns` for consistent date formatting (dd/MM/yyyy format)

2. **UI Store Integration** - Seamlessly connected with existing state management
   - Leveraged existing `startDate` and `endDate` fields already defined in `ExpenseFilters` type
   - Date range state managed through Zustand store alongside category and search filters
   - `setFilters` and `resetFilters` actions automatically handle date range updates
   - Clear filters button now includes date range in the reset operation

3. **Visual Integration** - Enhanced filter bar with cohesive design
   - Date picker button styled consistently with other filter controls
   - Dynamic button text shows selected range or prompts user to "Seleccionar fechas"
   - Calendar icon from lucide-react provides clear visual affordance
   - Responsive design maintains usability across different screen sizes

4. **Backend Compatibility** - Worked seamlessly with existing database layer
   - Database filtering logic (`getFilteredExpenses`) already supported date range filtering
   - Date comparison properly handles Date objects from the store
   - No modifications needed to data layer or API hooks
   - Filter changes trigger automatic query invalidation and refetch

This enhancement demonstrates the benefits of forward-thinking architecture. The `ExpenseFilters` type was designed with `startDate` and `endDate` fields from the beginning, and the database layer already implemented the filtering logic, making it trivial to add the UI component. The modular component design and separation of concerns allowed this significant feature addition with changes only to the filters component, showcasing how well-architected applications can evolve gracefully without requiring extensive refactoring.

## How to Run the Project

### Development Mode

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Production Build

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint        # Check for linting issues
npm run lint:fix    # Automatically fix linting issues
```

## Technical Decisions & Architecture

### Technology Stack

#### Core Framework

- **Next.js 16.0.4** - Chosen for its:
  - Built-in server-side rendering and static generation capabilities
  - App Router for modern routing patterns and layouts
  - Excellent developer experience with hot reload
  - Strong TypeScript support
  - Optimized production builds
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

#### Data Persistence

- **IndexedDB** - Browser-native database providing:
  - Large storage capacity (typically 50MB+)
  - Offline-first architecture
  - Fast, indexed queries
  - No backend infrastructure required
- **Dexie.js 4** - TypeScript-friendly IndexedDB wrapper offering:
  - Promise-based API for cleaner async code
  - Type-safe queries and schema definitions
  - Easy database versioning and migrations
  - React hooks integration via `dexie-react-hooks`
  - Excellent developer experience

#### State Management

- **Zustand** - Lightweight state management for UI state:
  - Minimal boilerplate compared to Redux
  - Hook-based API that feels natural in React
  - Perfect for sidebar state, modal visibility, and filter preferences
  - Small bundle size (~1KB)
- **TanStack Query (React Query) v5** - Powerful async state management:
  - Automatic caching and background refetching
  - Optimistic updates for instant UI feedback
  - Built-in loading and error states
  - Prevents redundant network requests
  - Ideal for managing expense data lifecycle

#### Form Handling & Validation

- **React Hook Form** - Performant form management:
  - Uncontrolled inputs for better performance
  - Minimal re-renders during form interactions
  - Easy integration with validation libraries
  - Built-in error handling
- **Zod** - TypeScript-first schema validation:
  - Runtime type checking for form inputs
  - Composable schema definitions
  - Excellent TypeScript inference
  - Single source of truth for validation rules

#### UI Components & Styling

- **Tailwind CSS 4** - Utility-first CSS framework:
  - Rapid UI development with utility classes
  - Consistent design system without custom CSS overhead
  - Automatic purging for minimal bundle sizes
  - Mobile-first responsive design patterns
  - New PostCSS plugin architecture in v4
- **Shadcn/ui (new-york variant)** - Component library providing:
  - Copy-paste components with full code ownership
  - Built on Radix UI primitives (WCAG-compliant accessibility)
  - Perfect Tailwind CSS integration
  - Zero runtime overhead - no external dependencies
  - TypeScript-first with complete type safety
  - Components used: Button, Card, Input, Label, Select, Table, Dialog, Form, Badge, Calendar, Sidebar, and more

#### Data Visualization

- **Recharts** - React charting library for dashboard:
  - Declarative chart components
  - Responsive and customizable
  - Built specifically for React
  - Line charts for spending trends
  - Pie/bar charts for category breakdowns

#### Additional Libraries

- **date-fns** - Modern date utility library (smaller than moment.js)
- **uuid** - Generate unique IDs for expense records
- **sonner** - Beautiful toast notifications for user feedback

#### Code Quality

- **ESLint 9** with Next.js config - Provides:
  - Consistent code style across the project
  - Early detection of potential bugs
  - Next.js-specific best practices enforcement
  - Automated code fixing with `lint:fix` script

### Project Architecture

#### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Dashboard (home page)
│   ├── globals.css               # Global styles and Tailwind directives
│   ├── expenses/
│   │   ├── page.tsx              # Expenses list table
│   │   ├── new/
│   │   │   └── page.tsx          # Create new expense form
│   │   └── [id]/
│   │       └── page.tsx          # Edit expense form
├── components/
│   ├── ui/                       # Shadcn components (Button, Card, etc.)
│   ├── layout/
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   └── header.tsx            # Page header
│   ├── dashboard/
│   │   ├── stats-cards.tsx       # Summary statistics cards
│   │   ├── expense-chart.tsx     # Spending visualization chart
│   │   └── recent-expenses.tsx   # Recent transactions list
│   ├── expenses/
│   │   ├── expenses-table.tsx    # Data table with sorting/filtering
│   │   ├── expense-form.tsx      # Reusable form component
│   │   ├── columns.tsx           # Table column definitions
│   │   └── filters.tsx           # Filter controls
│   └── shared/
│       ├── loading-skeleton.tsx  # Loading state skeletons
│       └── error-boundary.tsx    # Error boundary component
├── lib/
│   ├── db/
│   │   ├── index.ts              # Dexie database initialization
│   │   └── expenses.ts           # Expense CRUD operations
│   ├── validations/              # Zod schemas for validation
│   ├── utils.ts                  # Utility functions (cn, formatters)
│   └── constants.ts              # App constants (categories, etc.)
├── hooks/
│   ├── use-expenses.ts           # TanStack Query hooks for data fetching
│   └── use-expense-mutations.ts  # Mutation hooks (create/update/delete)
├── stores/
│   └── ui-store.ts               # Zustand store for UI state
├── types/
│   └── expense.ts                # TypeScript interfaces and types
└── providers/
    └── query-provider.tsx        # TanStack Query provider wrapper
```

This architecture follows Next.js 13+ conventions for:

- File-based routing with App Router
- Colocation of related components
- Clear separation of concerns (UI, logic, data)
- Server and Client Component separation
- Optimized rendering strategies

#### Data Model

```typescript
interface Expense {
  id: string;                    // UUID v4
  amount: number;                // Positive decimal
  description: string;           // User-provided description
  category: ExpenseCategory;     // Predefined category
  date: Date;                    // Expense date
  createdAt: Date;              // Record creation timestamp
  updatedAt: Date;              // Last modification timestamp
}

type ExpenseCategory = 
  | 'food' 
  | 'transport' 
  | 'entertainment' 
  | 'utilities' 
  | 'health' 
  | 'shopping' 
  | 'other';
```

### Key Architectural Decisions

#### 1. Offline-First with IndexedDB

**Decision:** Use IndexedDB via Dexie.js instead of a traditional backend database.

**Rationale:**
- No backend infrastructure or hosting costs required
- Instant read/write operations (no network latency)
- Works completely offline
- Sufficient storage for years of expense data
- Dexie.js provides type-safe, promise-based API
- Easy schema versioning for future migrations

#### 2. Separated State Management

**Decision:** Use Zustand for UI state and TanStack Query for server/async state.

**Rationale:**
- **Zustand** handles ephemeral UI state (sidebar open/closed, active filters, sort preferences)
  - Minimal boilerplate and small bundle size
  - Perfect for client-only state that doesn't need persistence
- **TanStack Query** manages expense data with:
  - Automatic caching to prevent redundant database reads
  - Background refetching to keep data fresh
  - Optimistic updates for instant UI feedback
  - Built-in loading and error states
  - Invalidation strategies for data consistency

This separation keeps concerns clean and leverages each tool's strengths.

#### 3. Form Handling Strategy

**Decision:** React Hook Form + Zod for all forms.

**Rationale:**
- **React Hook Form** uses uncontrolled inputs, reducing re-renders
- Shared form component works for both create and edit operations
- **Zod** provides runtime validation matching TypeScript types
- Single source of truth for validation rules
- Excellent error handling and user feedback
- Easy integration with Shadcn form components

#### 4. Component Organization

**Decision:** Feature-based component organization with shared UI library.

**Rationale:**
- `/components/ui` - Shadcn components (design system primitives)
- `/components/[feature]` - Feature-specific components (dashboard, expenses)
- `/components/layout` - Shared layout components (sidebar, header)
- `/components/shared` - Shared business components (error boundaries, skeletons)

This structure makes it easy to:
- Find components related to specific features
- Share common components without circular dependencies
- Scale the application as features grow

#### 5. Error & Loading Handling

**Decision:** Multi-layered error and loading state management.

**Implementation:**
- React Error Boundaries catch component-level errors
- TanStack Query provides `isLoading`, `isError`, `error` states per query
- Skeleton loaders for graceful loading states
- Toast notifications (Sonner) for user feedback on mutations
- Fallback UI for better user experience

#### 6. Routing Strategy

**Routes:**
- `/` - Dashboard with analytics and spending visualizations
- `/expenses` - Paginated expenses table with sorting and filtering
- `/expenses/new` - Create new expense form
- `/expenses/[id]` - Edit existing expense form

**Benefits:**
- Clear, RESTful URL structure
- Easy navigation and bookmarking
- Shared form component reduces code duplication
- Next.js App Router handles loading and error states per route

### Development Workflow

#### Local Development

```bash
npm run dev          # Start development server with hot reload
                     # Runs on http://localhost:3000
                     # Fast Refresh enabled for instant updates
```

#### Production Build

```bash
npm run build        # Create optimized production build
                     # Runs TypeScript compiler
                     # Generates static and dynamic routes
                     # Optimizes assets and bundles

npm start            # Serve production build locally
```

#### Code Quality

```bash
npm run lint         # Run ESLint to check code quality
                     # Identifies potential bugs and style issues
                     # Enforces Next.js best practices

npm run lint:fix     # Automatically fix linting issues
                     # Applies safe automatic fixes
                     # Manual review may be needed for complex issues
```

### Database Management

The application uses IndexedDB with the following characteristics:

- **Database Name:** `ExpensesDB`
- **Version:** 1
- **Schema:** Single `expenses` table with indexes on `date`, `category`, and `createdAt`
- **Storage Location:** Browser storage (persistent across sessions)
- **Data Persistence:** Automatic, no manual save required

#### Database Operations

All CRUD operations are handled through:
- `lib/db/expenses.ts` - Core database functions
- `hooks/use-expenses.ts` - Query hooks for fetching
- `hooks/use-expense-mutations.ts` - Mutation hooks for modifications

#### Clearing Data

To reset the database during development:
```javascript
// In browser console
indexedDB.deleteDatabase('ExpensesDB');
// Then refresh the page
```

## Browser Compatibility

This application requires a modern browser with support for:
- IndexedDB (all modern browsers)
- ES2020+ features
- CSS Grid and Flexbox
- Web Storage API

**Recommended browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

Potential features for future development:
- 📤 Export data to CSV/PDF
- 📅 Budget tracking and alerts
- 🔄 Data sync across devices (cloud backup)
- 🏷️ Custom categories and tags
- 📊 More advanced analytics and reports
- 🌙 Dark mode theme
- 🔍 Full-text search across descriptions
- 📎 Attachment support (receipts, invoices)

## Contributing

This is a personal project, but suggestions and feedback are welcome!
