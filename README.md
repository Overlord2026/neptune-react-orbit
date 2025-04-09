# Project Neptune

Project Neptune is a confidential tax planning feature suite designed to enhance financial decision-making capabilities.

## Table of Contents
- [Color Palette and Theme](#color-palette-and-theme)
- [Using the Dashboard Layout](#using-the-dashboard-layout)
- [Card Components](#card-components)
- [Page Organization](#page-organization)
- [Responsive Design](#responsive-design)

## Color Palette and Theme

### Core Colors
- **Background:**
  - Primary: `#111111` (Dark background)
  - Secondary: `#1E1E1E` (Cards, containers)
  - Tertiary: `#222222` (Highlights, hover states)

- **Accent/Brand:**
  - Gold: `#FFD700` (Primary accent color)
  - Gold Hover: `#E5C100` (Darker gold for hover states)

- **Text:**
  - Primary: `#FFFFFF` (White text)
  - Secondary: `#A0A0A0` (Muted text)
  - Accent: `#FFD700` (Gold text for emphasis)

- **Status Colors:**
  - Success: `#4CAF50` (Green)
  - Warning: `#FFA500` (Orange) 
  - Error: `#FF4D4D` (Red)

### Theme Usage

The theme is defined in multiple locations:

1. **CSS Variables:**
   - See `src/index.css` and `src/styles/globalStyles.css` for CSS variables
   - Example usage: `var(--bg-primary)`, `var(--accent)`

2. **Tailwind Configuration:**
   - Extended theme in `tailwind.config.ts`
   - Example usage: `bg-custom-background-primary`, `text-custom-accent`

3. **Theme Object:**
   - JavaScript theme object in `src/styles/theme.js`
   - Import with: `import { colors, typography } from '../styles/theme'`

### Button Variants

1. **Primary Button:**
   ```jsx
   <Button className="bg-[#FFD700] text-black hover:bg-[#E5C100] transition-colors duration-200">
     Primary Action
   </Button>
   ```

2. **Secondary Button:**
   ```jsx
   <Button variant="secondary" className="border border-[#FFD700] text-[#FFD700] hover:bg-[#222222] transition-colors duration-200">
     Secondary Action
   </Button>
   ```

## Using the Dashboard Layout

The `DashboardLayout` component provides a consistent page structure with navigation sidebar and header.

### Basic Usage

1. **Import the layout:**

```tsx
import DashboardLayout from "../components/DashboardLayout";
```

2. **Use the layout in your route configurations:**

The layout is already configured in `App.tsx` to wrap your page components:

```tsx
// From App.tsx
<Route path="/" element={<DashboardLayout />}>
  <Route index element={<Index />} />
  <Route path="calendar" element={<Calendar />} />
  {/* Other routes */}
</Route>
```

3. **Creating a new page component:**

```tsx
import React from 'react';

const NewPage = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Page Title</h1>
      {/* Page content */}
    </div>
  );
};

export default NewPage;
```

## Card Components

### StatCard

Used for displaying metrics or statistics with optional change indicators.

```tsx
import StatCard from '@/components/StatCard';
import { BarChart3 } from 'lucide-react';

// Usage
<StatCard 
  title="Total Revenue"
  value="$24,500"
  change="+12%"
  timeframe="vs. last month"
  icon={<BarChart3 className="h-5 w-5 text-[#FFD700]" />}
/>
```

### StatsCard

A simpler card for displaying metrics.

```tsx
import StatsCard from '@/components/dashboard/StatsCard';
import { Users } from 'lucide-react';

// Usage
<StatsCard
  title="Active Users"
  value="1,234"
  description="7% increase from last month"
  icon={<Users className="h-5 w-5" />}
/>
```

### Creating Custom Card Components

Follow these guidelines when creating new card components:

1. Use consistent padding: `p-6` or `p-4 md:p-6`
2. Maintain consistent border radius with `rounded-md` or `rounded-lg`
3. Use the theme colors: 
   - Background: `bg-[#1E1E1E]`
   - Border: `border-[#333333]`
   - Hover: `hover:border-[#444444]` or `hover:border-[#FFD700]`
4. Implement hover transitions: `transition-colors duration-200`

## Page Organization

### Page Structure

1. **Core Pages:** Place in `src/pages/`
   - Example: `Index.tsx`, `Calendar.tsx`, `Settings.tsx`

2. **Feature-specific Pages:** Also in `src/pages/` with descriptive names
   - Example: `TaxPlanningLandingPage.tsx`, `RothConversionAnalyzerPage.tsx`

3. **Administrative Pages:** In `src/pages/` with "Admin" prefix
   - Example: `AdminDashboardPage.tsx`

### Adding New Pages

1. Create the page component in `src/pages/`
2. Add the route to `App.tsx`:

```tsx
// In App.tsx
<Route path="new-feature" element={<NewFeaturePage />} />
```

3. Add navigation links in the appropriate location, such as `Sidebar.tsx`

## Responsive Design

Project Neptune uses a mobile-first approach with responsive breakpoints.

### Breakpoints

```
- xs: (Default) Mobile-first design
- sm: 640px and above
- md: 768px and above
- lg: 1024px and above
- xl: 1280px and above
- 2xl: 1536px and above
```

### Mobile Sidebar

The responsive sidebar automatically converts to a drawer on mobile screens:

```tsx
{isMobile ? (
  <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
    <DrawerOverlay />
    <DrawerContent className="p-0 max-w-[80%]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
    </DrawerContent>
  </Drawer>
) : (
  <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
)}
```

### Responsive Grid

For card layouts, use these grid patterns:

```jsx
// Responsive grid that adjusts from 1 to 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {/* Cards */}
</div>

// Two-column layout that stacks on mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  {/* Content */}
</div>
```

### Customizing Breakpoints

To customize breakpoints beyond what's provided by Tailwind:

1. Add custom breakpoints in `tailwind.config.ts`:

```js
theme: {
  screens: {
    'xs': '375px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
}
```

2. Use custom media queries when needed:

```css
@media (min-width: 540px) {
  /* Custom breakpoint styles */
}
```

## Best Practices

1. **Maintain Theme Consistency**
   - Use established color variables and classes
   - Follow existing component patterns

2. **Responsive Development**
   - Start with mobile-first approach
   - Test across different screen sizes frequently

3. **Accessibility**
   - Ensure sufficient color contrast
   - Include focus states for interactive elements
   - Use semantic HTML elements

4. **Component Organization**
   - Keep components focused and modular
   - Use consistent naming conventions
