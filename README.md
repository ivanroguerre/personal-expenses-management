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

#### Dashboard Total Month Expenses Stat Evolution

A data accuracy and UX enhancement focused on properly handling edge cases in monthly expense comparison calculations:

**Initial State:**
- Monthly change percentage calculated as: `((totalThisMonth - totalLastMonth) / totalLastMonth) * 100`
- When last month had zero expenses (`totalLastMonth = 0`), returned `0%` to avoid division by zero
- Misleading display: going from $0 to any positive amount showed "0% change" instead of indicating new spending
- No semantic distinction between "no change" and "unable to calculate change"
- Stats interface defined inline without type reusability

**Iterative Improvements:**
1. **Created ExpenseStats Interface** - Added formal type definition for statistics data (`src/types/expense.ts`)
   - Defined `ExpenseStats` interface with all statistics fields properly typed
   - `monthlyChange` property typed as `number | null` to support edge cases
   - Includes all dashboard metrics: totals, counts, category breakdowns, and temporal aggregations
   - Provides type safety and reusability across components and hooks
   - Serves as single source of truth for statistics data structure

2. **Enhanced Monthly Change Calculation** - Implemented three-case logic for accurate representations (`src/lib/db/expenses.ts`)
   - **Case 1:** `totalLastMonth > 0` - Normal calculation: `((totalThisMonth - totalLastMonth) / totalLastMonth) * 100`
   - **Case 2:** `totalLastMonth = 0` AND `totalThisMonth > 0` - Returns `null` (new spending, no baseline for comparison)
   - **Case 3:** Both months are `0` - Returns `0` (truly no change between zero and zero)
   - Function signature updated to return `Promise<ExpenseStats>` for type consistency
   - Mathematically honest: `null` indicates "not calculable" rather than falsely claiming 0% change

3. **Updated StatsCards Component** - Enhanced UI to handle null values with appropriate messaging (`src/components/dashboard/stats-cards.tsx`)
   - Imported and used `ExpenseStats` type instead of inline interface definition
   - Created helper function `getMonthlyChangeDescription()` to generate context-aware text:
     - `null` → "Nuevo gasto este mes" (New spending this month)
     - `0` → "Sin cambios desde el mes pasado" (No changes from last month)
     - Positive/negative → "+X% desde el mes pasado" or "X% desde el mes pasado"
   - Created helper function `getMonthlyChangeIcon()` to select appropriate visual indicator
   - Created helper function `getMonthlyChangeColor()` to apply semantic colors:
     - `null` → Blue (informational - new spending)
     - Positive → Red (warning - spending increased)
     - Negative → Green (positive - spending decreased)
     - Zero → Muted (neutral - no change)

4. **Improved User Understanding** - Provided clear, actionable information in the dashboard
   - Users now receive accurate feedback when starting to track expenses in a new month
   - "Nuevo gasto este mes" message sets clear expectations rather than confusing with 0%
   - Blue color for new spending differentiates from both increases (red) and decreases (green)
   - Maintains mathematical accuracy while improving user comprehension
   - Semantic nullability pattern enables future enhancements (e.g., showing "N/A" or additional context)

This enhancement demonstrates the importance of handling edge cases thoughtfully in data-driven applications. By recognizing that percentage change is undefined when the baseline is zero, the implementation avoids misleading users with mathematically incorrect information. The use of TypeScript's union types (`number | null`) enforces proper null handling throughout the component tree, preventing runtime errors while enabling more informative UI states. This pattern of semantic nullability—using `null` to represent "not applicable" rather than forcing a numeric value—is a best practice for representing real-world data constraints in type-safe applications.

#### Dashboard Daily Average Stat Evolution

A descriptive enhancement focused on providing better context for the daily average expense statistic by showing the total count of expenses:

**Initial State:**
- Daily average expense card displayed calculated average amount
- Description text was generic: "Por gasto diario" (Per daily expense)
- No indication of how many expenses were used to calculate the average
- Users couldn't quickly assess if the average was based on 1 expense or 10 expenses
- Less transparency in the calculation methodology

**Iterative Improvements:**
1. **Extended ExpenseStats Interface** - Added support for today's expense count (`src/types/expense.ts`)
   - Added `todayExpenseCount: number` property to `ExpenseStats` interface
   - Provides type-safe access to the count of expenses for the current day
   - Complements existing `averageTodayExpense` field for better context
   - Maintains consistency with existing count fields like `currentMonthExpenseCount`

2. **Enhanced Statistics Calculation** - Updated backend to return expense count (`src/lib/db/expenses.ts`)
   - Modified `getExpenseStats()` function to include `todayExpenseCount` in return object
   - Leverages existing `todayExpenses` array calculation (already filtered for current day)
   - Simply returns `todayExpenses.length` alongside the average calculation
   - No additional database queries or performance impact
   - Reuses the same filtered data used for computing `averageTodayExpense`

3. **Improved Card Description** - Enhanced user-facing text with dynamic count display (`src/components/dashboard/stats-cards.tsx`)
   - Changed from static "Por gasto diario" to dynamic template literal
   - New description: `De un total de ${stats.todayExpenseCount} ${stats.todayExpenseCount === 1 ? 'gasto' : 'gastos'}`
   - Displays "De un total de 1 gasto" for single expense (singular form)
   - Displays "De un total de X gastos" for multiple expenses (plural form)
   - Grammatically correct Spanish with proper singular/plural handling
   - Provides immediate transparency about the sample size used for averaging

4. **Enhanced Data Transparency** - Users now have complete context for the daily average metric
   - Clear understanding of whether average is based on few or many expenses
   - Helps users assess the reliability and representativeness of the average
   - Particularly valuable on days with unusual spending patterns
   - Example: "€45.50 - De un total de 3 gastos" tells users the average is from 3 transactions
   - Better decision-making support when reviewing daily spending habits

This enhancement demonstrates the value of providing contextual information alongside calculated metrics. By showing both the average amount and the count of expenses, users gain a more complete picture of their daily spending patterns. The implementation efficiently reuses existing calculations and maintains grammatical correctness through conditional rendering, showcasing attention to both technical efficiency and user experience details. This pattern of pairing aggregated statistics with their underlying data points is a UX best practice in analytics dashboards.

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

#### Expenses List Actions Language Evolution

A focused internationalization refinement that completed the Spanish localization of the expenses table by translating action menu elements:

**Initial State:**
- Actions dropdown menu displayed in English
- Screen reader text: "Open menu"
- Menu label: "Actions"
- Menu items: "Edit", "Delete"
- Inconsistent language experience within the expenses table
- Mixed Spanish/English interface reducing user experience quality

**Iterative Improvements:**
1. **Action Menu Translation** - Localized all interactive elements in the table's dropdown menu (`src/components/expenses/columns.tsx`)
   - Screen reader accessibility text changed from "Open menu" to "Abrir menú"
   - Dropdown menu label updated from "Actions" to "Acciones"
   - Edit action button translated to "Editar"
   - Delete action button translated to "Eliminar"
   - Maintained all existing functionality and event handlers

2. **Accessibility Preservation** - Ensured screen reader support remains complete in Spanish
   - `sr-only` class maintained for proper screen reader behavior
   - Semantic meaning preserved across language translation
   - ARIA labels and accessibility features work correctly in Spanish
   - No degradation of accessibility standards during localization

3. **Component Structure Maintained** - Translation applied without altering component architecture
   - Column configuration function signature unchanged
   - Render functions maintain same TypeScript types
   - Icon components (Pencil, Trash2) preserved with translated text labels
   - Dropdown menu component hierarchy and styling unaffected
   - No breaking changes to the component's API or props

4. **Complete Language Consistency** - Achieved unified Spanish experience across all table interactions
   - All user-facing text in the expenses table now in Spanish
   - Consistent language from headers through filters to actions
   - Eliminates cognitive load from language switching mid-workflow
   - Professional, polished user experience for Spanish-speaking users

This final localization step completes the Spanish language transformation of the expenses list interface. By translating the action menu—one of the most frequently accessed interactive elements—the application now provides a fully cohesive Spanish experience. The attention to detail in translating even accessibility text demonstrates a commitment to inclusive design, ensuring that assistive technology users also receive a properly localized experience.

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

#### Expenses List Date Range Language Evolution

A localization refinement focused on adapting the calendar date picker interface to properly display in Spanish:

**Initial State:**
- Date range picker displayed in default English locale
- Month names shown in English (January, February, etc.)
- Weekday abbreviations in English (Mo, Tu, We, etc.)
- Inconsistent with the rest of the Spanish-localized interface
- Generic date formatting without locale-specific conventions

**Iterative Improvements:**
1. **Spanish Locale Integration** - Added `date-fns` Spanish locale throughout the component
   - Imported `es` locale from `date-fns/locale`
   - Passed locale to the Calendar component via the `locale` prop
   - Updated all `format()` function calls to include `{ locale: es }` parameter
   - Calendar now displays in Spanish by default

2. **Custom Formatters for Proper Capitalization** - Implemented formatters to match Spanish conventions
   - Added `formatWeekdayName` formatter to capitalize weekday abbreviations (Lu, Ma, Mi, etc.)
   - Added `formatMonthCaption` formatter to capitalize month names (Enero 2025, Febrero 2025, etc.)
   - Spanish locale provides lowercase strings by default; formatters ensure proper title case
   - Maintains consistent capitalization with other UI elements throughout the application

3. **Date Display Consistency** - Ensured formatted dates match the calendar locale
   - Button trigger showing selected date range now uses Spanish locale
   - Date format (dd/MM/yyyy) remains the same but respects locale-specific rendering
   - Seamless integration between calendar selection and displayed date range
   - All date-related text now consistently in Spanish across the filtering interface

4. **React Day Picker Integration** - Leveraged built-in locale support from underlying library
   - `react-day-picker` natively supports `date-fns` locales
   - No modifications needed to the base Calendar component
   - Locale prop passed through component hierarchy cleanly
   - Maintains all existing calendar functionality while switching languages

This localization improvement completes the Spanish language experience for the expenses filtering system, ensuring that all user-facing elements—including the sophisticated date range picker—are consistently presented in Spanish. The use of custom formatters demonstrates attention to linguistic detail, as Spanish capitalization conventions differ from English in calendar contexts. This enhancement showcases how modern date libraries like `date-fns` and `react-day-picker` make internationalization straightforward when properly integrated.

#### Expenses List Column Order Evolution

A UX-focused refinement to optimize the table layout based on information hierarchy and scanning patterns:

**Initial State:**
- Column order: "Fecha" (Date), "Descripción" (Description), "Categoría" (Category), "Monto" (Amount)
- Date column positioned first as primary information
- Amount displayed last, requiring users to scan across the entire row
- Conventional chronological-first approach common in many data tables

**Iterative Improvements:**
1. **Reordered Column Layout** - Restructured table columns to prioritize key expense information
   - New order: "Descripción", "Monto", "Categoría", "Fecha"
   - Description moved to first position as the primary identifier for each expense
   - Amount positioned second for immediate visibility of spending values
   - Category placed third for quick visual categorization via color-coded badges
   - Date moved to fourth position, still accessible but no longer the primary focus

2. **Header Updates** - Applied consistent column order across all table states
   - Updated sortable table headers in the main view to match new order
   - Modified loading skeleton structure to reflect new column positions
   - Maintained SortButton functionality for all columns in their new positions
   - Preserved all existing sort capabilities without breaking functionality

3. **Data Row Consistency** - Ensured data cells aligned perfectly with new header structure
   - Updated TableCell rendering order to match header sequence
   - Maintained proper text alignment (amount stays right-aligned)
   - Preserved column-specific styling (e.g., category badges, date formatting)
   - Actions column remained in the rightmost position for consistent interaction patterns

4. **Improved Scanning Efficiency** - Enhanced user experience through better information hierarchy
   - Users can now quickly identify expenses by description without reading full rows
   - Amount visibility improved for rapid spending assessment
   - Visual category badges provide at-a-glance classification after amount
   - Date information available but doesn't dominate the visual hierarchy

This reordering demonstrates how small layout adjustments can significantly impact usability. By placing the most frequently referenced information (description and amount) at the beginning of each row, users can scan and process expense data more efficiently. The change prioritizes "what was spent and how much" over "when it was spent," which better aligns with typical expense review workflows where users want to quickly identify and verify spending amounts rather than focusing primarily on chronological order.

#### Expenses List Pagination Evolution

A scalability-focused enhancement to handle large datasets efficiently by implementing table pagination:

**Initial State:**
- All expenses displayed in a single, continuously scrolling table
- No limit on the number of rows shown simultaneously
- Performance concerns with large datasets (hundreds or thousands of expenses)
- Difficult to navigate and find specific expenses in long lists
- Overwhelming user experience when viewing extensive expense history

**Iterative Improvements:**
1. **Pagination State Management** - Integrated pagination controls into the existing UI store
   - Added `page` state (default: 1) to track current page position
   - Added `pageSize` state (default: 20) to control rows per page
   - Implemented `setPage()` and `setPageSize()` actions for navigation control
   - Added `resetPagination()` utility to restore default pagination state
   - Existing `setFilters()` and `setSort()` now automatically reset to page 1 to prevent empty page views

2. **Table Pagination Logic** - Enhanced table component with intelligent data slicing
   - Calculated pagination values: `totalItems`, `totalPages`, `startIndex`, `endIndex`
   - Implemented expense slicing to show only current page's subset of data
   - Added automatic page adjustment when total pages decrease (prevents showing empty pages)
   - Maintained all existing functionality (sorting, filtering, loading states) while paginating results
   - Zero performance impact on filtering or sorting operations

3. **Pagination Controls UI** - Designed intuitive navigation interface below the table
   - **Page size selector** - Dropdown with options: 10, 20, 50, 100 rows per page
   - **Navigation buttons** - Previous/Next page buttons with ChevronLeft/ChevronRight icons
   - **Information display** - Shows "X-Y de Z" format (e.g., "1-20 de 150 gastos")
   - **Smart disabled states** - Buttons disabled at first/last page to prevent invalid navigation
   - Consistent Spanish localization matching the rest of the expenses interface

4. **User Experience Optimization** - Thoughtful design decisions for better usability
   - Default 20 rows strikes balance between information density and performance
   - Page size selector positioned on the left for easy access
   - Navigation controls and info display aligned to the right for visual hierarchy
   - Responsive layout maintains usability across different screen sizes
   - Shadcn Select and Button components ensure design consistency with existing UI

This pagination implementation demonstrates the application's readiness to scale with growing datasets. Rather than implementing the full-featured Shadcn DataTable component, this lightweight custom solution leverages the existing table structure and adds only the essential pagination features needed. The clean integration with the UI store and automatic page reset behavior create an intuitive experience where users don't have to think about pagination edge cases—the system handles them automatically. This approach maintains code simplicity while solving the core scalability challenge of displaying large expense lists.

#### Expenses List Default Date Range Filter Evolution

A smart filtering enhancement focused on providing a more relevant default view by limiting expenses to the current year:

**Initial State:**
- Expenses list displayed all expenses regardless of date by default
- No temporal filtering applied on initial page load
- Users viewing expenses spanning multiple years would see everything mixed together
- Required manual date range selection to focus on specific time periods
- `defaultFilters` in UI store was an empty object with no date constraints

**Iterative Improvements:**
1. **Current Year Calculation Helper** - Added intelligent date range generation
   - Created `getCurrentYearDateRange()` function to compute year boundaries dynamically
   - Calculates start of year: January 1st at midnight (00:00:00)
   - Calculates end of year: December 31st at 23:59:59.999
   - Returns typed object with `startOfYear` and `endOfYear` Date objects
   - Executes once on module load for optimal performance

2. **Default Filter Enhancement** - Updated UI store to apply year filter automatically
   - Modified `defaultFilters` to include `startDate` and `endDate` properties
   - Uses calculated year boundaries from helper function
   - Filter applied on initial load without user interaction
   - Seamlessly integrates with existing filter architecture
   - No changes needed to filter types or component interfaces

3. **Date Picker Visual Feedback** - Enhanced user awareness of active filtering
   - Date range picker now displays current year dates by default
   - Button shows selected range (e.g., "01/01/2025 - 31/12/2025")
   - Makes it immediately clear to users that temporal filtering is active
   - Provides intuitive starting point for adjusting date ranges
   - Users can easily clear or modify the date filter using existing controls

4. **Reset Behavior Consistency** - Maintained expected filter reset functionality
   - "Limpiar filtros" button now resets to current year (not all-time)
   - Consistent with the principle that default view shows current year
   - Prevents accidental exposure to multi-year historical data
   - Users must explicitly adjust date range to view previous years
   - Aligns with typical expense management workflows focused on current period

This enhancement demonstrates thoughtful UX design for temporal data. By defaulting to the current year, the application provides a more focused and relevant view for most users' primary use case—managing current expenses. The implementation is clean and efficient, calculating the date range once at module initialization rather than on every render. This approach respects the existing filter architecture while improving the out-of-box experience, especially valuable for users with extensive expense history spanning multiple years. The automatic year boundary detection ensures the filter stays relevant as time progresses, requiring no manual updates when the calendar year changes.

#### Add/Edit Expenses Language Evolution

A comprehensive internationalization enhancement focused on adapting the expense creation and editing interfaces for Spanish-speaking users:

**Initial State:**
- New expense page displayed entirely in English
- Edit expense page and error messages in English
- Form labels, placeholders, and buttons in English
- Validation error messages in English
- Calendar component using default English locale
- Inconsistent with the Spanish-localized expenses list interface

**Iterative Improvements:**
1. **New Expense Page Translation** - Localized the add expense page interface (`src/app/expenses/new/page.tsx`)
   - Page title changed from "Add Expense" to "Agregar Gasto"
   - Page description updated from "Record a new expense" to "Registrar un nuevo gasto"
   - Card title changed from "New Expense" to "Nuevo Gasto"
   - Maintained clean component structure with no logic changes
   - Consistent Spanish terminology across all visible text elements

2. **Expense Form Component Translation** - Adapted all form inputs and labels (`src/components/expenses/expense-form.tsx`)
   - Amount field label changed from "Amount ($)" to "Monto ($)"
   - Description field label changed from "Description" to "Descripción"
   - Description placeholder updated from "What was this expense for?" to "¿Para qué fue este gasto?"
   - Category label changed from "Category" to "Categoría"
   - Category placeholder changed from "Select a category" to "Selecciona una categoría"
   - Date field label changed from "Date" to "Fecha"
   - Date picker placeholder updated from "Pick a date" to "Elige una fecha"
   - Submit button text changed from "Add Expense"/"Update Expense" to "Agregar Gasto"/"Actualizar Gasto"
   - Spanish locale integration for calendar date formatting

3. **Calendar Localization** - Configured date picker to display in Spanish with proper formatting
   - Imported Spanish locale (`es`) from `date-fns/locale`
   - Applied locale to date formatting in both display and calendar components
   - Added custom formatters for proper Spanish capitalization conventions:
     - Weekday names formatted with capital first letter (Lu, Ma, Mi, Ju, Vi, Sa, Do)
     - Month captions formatted with capital first letter (Enero 2025, Febrero 2025, etc.)
   - Calendar now displays month and day names in Spanish by default
   - Date display format uses Spanish locale for consistency with selected dates
   - Seamless integration with `react-day-picker` locale support

4. **Validation Schema Translation** - Localized all form validation error messages (`src/lib/validations/expense.ts`)
   - Amount required message: "Amount is required" → "El monto es requerido"
   - Amount positive validation: "Amount must be positive" → "El monto debe ser positivo"
   - Amount max validation: "Amount cannot exceed 1,000,000" → "El monto no puede exceder 1,000,000"
   - Description required: "Description is required" → "La descripción es requerida"
   - Description max length: "Description cannot exceed 200 characters" → "La descripción no puede exceder 200 caracteres"
   - Category required: "Please select a category" → "Por favor selecciona una categoría"
   - Date required: "Date is required" → "La fecha es requerida"
   - Users now receive validation feedback in Spanish, improving clarity and usability

5. **Edit Expense Page Translation** - Localized the edit expense interface (`src/app/expenses/[id]/page.tsx`)
   - Page title changed from "Edit Expense" to "Editar Gasto"
   - Page description updated from "Modify expense details" to "Modificar detalles del gasto"
   - Card title changed from "Edit Expense" to "Editar Gasto"
   - Error state message updated from "Expense not found" to "Gasto no encontrado"
   - Error description changed from "The expense you're looking for doesn't exist or has been deleted." to "El gasto que buscas no existe o ha sido eliminado."
   - Back button text updated from "Back to Expenses" to "Volver a Gastos"
   - Complete Spanish experience across all page states (loading, error, and success)

6. **Code Quality Preservation** - Maintained development best practices during localization
   - All code, variable names, function names, and comments remained in English
   - TypeScript types and interfaces preserved without modifications
   - No changes to component logic, props, or data flow
   - Form validation logic remained unchanged, only messages translated
   - Component architecture and file organization unaffected
   - Zero breaking changes to component APIs or state management

This comprehensive localization completes the Spanish language transformation of the expense management workflow, covering both creation and editing interfaces. Users can now add, view, edit, and delete expenses entirely in Spanish, from page titles and form labels to validation messages and calendar interfaces. The systematic approach ensures linguistic consistency across all user touchpoints while maintaining code quality and architectural integrity. The integration of Spanish locale for date formatting demonstrates attention to cultural conventions, as date presentation differs between languages. This enhancement showcases the application's commitment to accessibility and user experience for Spanish-speaking audiences, providing a fully native language experience without compromising the technical foundation.

#### Add/Edit Expenses Field Order Evolution

A UX-focused refinement to optimize the form layout based on information hierarchy and natural data entry flow:

**Initial State:**
- Field order: "Monto" (Amount), "Descripción" (Description), "Categoría" (Category), "Fecha" (Date)
- Amount field positioned first as primary input
- Description placed second, requiring users to think about quantity before context
- Standard form order but not aligned with natural expense logging workflow

**Iterative Improvements:**
1. **Reordered Form Fields** - Restructured input sequence to match natural thought process
   - New order: "Descripción", "Monto", "Categoría", "Fecha"
   - Description moved to first position as the primary identifier for each expense
   - Amount positioned second after users have established what the expense was for
   - Category placed third for logical classification after description and amount
   - Date remains in fourth position, maintaining its role as temporal metadata

2. **Improved Data Entry Flow** - Enhanced user experience through better field progression
   - Users now naturally describe what they spent money on before entering the amount
   - Cognitive flow matches real-world expense reporting: "I bought X for Y amount"
   - Reduces mental context switching during data entry
   - More intuitive tab order for keyboard navigation users

3. **Form Component Consistency** - Applied changes consistently across all form instances
   - Updated `expense-form.tsx` component to reflect new field order
   - Reordering affects both create new expense and edit expense flows
   - Maintained all existing validation logic and error handling
   - No changes to form submission or data processing logic
   - Preserved all field labels, placeholders, and help text

4. **Maintained Default Values** - Ensured proper pre-population for edit operations
   - Default values in form initialization remain correctly mapped to new field positions
   - Edit mode continues to populate all fields accurately from existing expense data
   - Visual field order change doesn't affect underlying data structure or storage
   - Form state management and react-hook-form integration unaffected

This reordering demonstrates how thoughtful form design can reduce cognitive friction during data entry. By placing the description field first, users can establish context before thinking about numerical values, creating a more natural narrative flow: "I spent money on [description] which cost [amount] in the [category] category on [date]." This seemingly minor adjustment aligns the form structure with how users mentally process and recall expenses, potentially reducing data entry errors and improving overall satisfaction with the expense logging experience.

#### Add/Edit Expenses Categories Language Evolution

A localization enhancement focused on translating expense category labels to Spanish while maintaining backward compatibility with existing user data:

**Initial State:**
- Category labels displayed in English across the entire application
- Categories: "Food & Dining", "Transportation", "Entertainment", "Utilities & Bills", "Health & Medical", "Shopping", "Other"
- Internal category keys stored in IndexedDB: 'food', 'transport', 'entertainment', 'utilities', 'health', 'shopping', 'other'
- Inconsistent with the Spanish-localized interface throughout the rest of the application
- Users with existing data in their browser's IndexedDB needed to be considered

**Iterative Improvements:**
1. **Category Labels Translation** - Updated display labels to Spanish in the types definition (`src/types/expense.ts`)
   - Changed "Food & Dining" to "Comida"
   - Changed "Transportation" to "Transporte"
   - Changed "Entertainment" to "Entretenimiento"
   - Changed "Utilities & Bills" to "Servicios"
   - Changed "Health & Medical" to "Salud"
   - Changed "Shopping" to "Compras"
   - Changed "Other" to "Otros"
   - Maintained internal keys unchanged for data compatibility

2. **Backward Compatibility Preservation** - Ensured existing user data remained intact
   - Internal category keys ('food', 'transport', etc.) kept unchanged in `EXPENSE_CATEGORIES`
   - No database migration required as stored values remain the same
   - Existing expenses automatically display with new Spanish labels
   - Zero data loss or corruption risk for users with existing data
   - No breaking changes to the data model or database schema

3. **Application-Wide Consistency** - Spanish labels now display throughout all interfaces
   - Expense form category dropdown shows Spanish labels
   - Expenses table category column displays Spanish labels
   - Filter dropdowns show Spanish category names
   - Dashboard analytics and charts use Spanish category labels
   - Color-coded category badges maintain their styling with new labels
   - Seamless integration across all components using `CATEGORY_LABELS`

4. **Type Safety Maintained** - TypeScript types ensure category usage remains correct
   - `ExpenseCategory` type union still enforces valid category values
   - `CATEGORY_LABELS` Record type ensures all categories have Spanish labels
   - `CATEGORY_COLORS` Record type maintains color mappings with no changes needed
   - Compile-time checking prevents missing or incorrect category references
   - No runtime errors introduced by the label changes

This localization strategy demonstrates a pragmatic approach to internationalization with existing user data. By maintaining the internal category keys while only changing display labels, the application achieves complete Spanish localization without requiring database migrations or risking data integrity. The architecture's separation between data storage (internal keys) and presentation (display labels) proved invaluable, allowing this change to be implemented safely with a single file modification. This approach ensures that users with months or years of expense data can seamlessly continue using the application with the new Spanish interface, with all their historical data displaying correctly under the new labels.

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
