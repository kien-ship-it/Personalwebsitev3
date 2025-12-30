# Frontend Design Guide

## Overview

This design guide documents the visual design system and interface standards for the Build Crew application. The design follows a dark, modern aesthetic with careful attention to typography, spacing, and component consistency.

## Design Philosophy

- **Dark-first design**: Primary background of `#050505` with carefully chosen neutral grays
- **Minimal and clean**: Focus on content with generous white space
- **Typography-driven**: Strong emphasis on font choices and text hierarchy
- **Subtle interactions**: Smooth transitions and hover states without being distracting
- **Accessibility-focused**: High contrast ratios and semantic HTML structure

## Color System

### Primary Colors
```css
--background: #050505          /* Main background */
--foreground: oklch(0.985 0 0) /* Primary text (near white) */
--primary: #030213             /* Primary brand color (very dark blue) */
--primary-foreground: oklch(1 0 0) /* Text on primary (white) */
```

### Accent Colors
```css
--accent-red: #d4183d          /* Red accent (destructive actions) */
--accent-red-selection: rgba(212, 24, 61, 0.3) /* Selection highlight */
```

### Neutral Scale
```css
--neutral-200: oklch(0.922 0 0) /* Lightest gray */
--neutral-400: oklch(0.708 0 0) /* Light gray */
--neutral-500: oklch(0.556 0 0) /* Medium gray */
--neutral-600: oklch(0.439 0 0) /* Dark gray */
--neutral-700: oklch(0.371 0 0) /* Darker gray */
--neutral-800: oklch(0.269 0 0) /* Very dark gray */
--neutral-900: oklch(0.205 0 0) /* Darkest gray */
```

### Semantic Colors
```css
--card: #111                   /* Card backgrounds */
--card-dark: #0A0A0A          /* Darker card variant */
--border: rgba(0, 0, 0, 0.1)  /* Light borders */
--border-dark: var(--neutral-800) /* Dark borders */
--border-darker: var(--neutral-900) /* Darkest borders */
```

## Typography

### Font Families
```css
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
```

### Font Weights
```css
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-bold: 700
```

### Text Sizes & Line Heights
```css
--text-xs: 0.75rem     /* 12px - Small labels, captions */
--text-sm: 0.875rem    /* 14px - Body text, descriptions */
--text-base: 1rem      /* 16px - Default body text */
--text-lg: 1.125rem    /* 18px - Large body text */
--text-xl: 1.25rem     /* 20px - Subheadings */
--text-2xl: 1.5rem     /* 24px - Section headings */
--text-3xl: 1.875rem   /* 30px - Page headings */
--text-4xl: 2.25rem    /* 36px - Large headings */
--text-6xl: 3.75rem    /* 60px - Hero text */
```

### Typography Hierarchy

#### Headings
- **H1 (Hero)**: `text-6xl md:text-[5rem]` + `font-serif italic` + `leading-[0.9]` + `tracking-tight`
- **H2 (Section)**: `text-3xl md:text-4xl` + `font-serif italic`
- **H3 (Subsection)**: `text-lg` + `font-bold`
- **H4 (Component)**: `text-base` + `font-medium`

#### Body Text
- **Primary**: `text-lg md:text-xl` + `text-neutral-400` + `leading-relaxed` + `font-light`
- **Secondary**: `text-sm` + `text-neutral-500` + `leading-relaxed`
- **Caption**: `text-xs` + `text-neutral-600` + `font-medium`

#### Special Text
- **Monospace labels**: `font-mono` + `text-sm` + `text-neutral-500`
- **Italic descriptions**: `font-serif italic` + `text-xs md:text-sm` + `text-neutral-500`

## Spacing System

### Base Spacing Unit
```css
--spacing: 0.25rem /* 4px base unit */
```

### Common Spacing Values
- `gap-2` = 8px (2 × 4px)
- `gap-3` = 12px (3 × 4px)
- `gap-5` = 20px (5 × 4px)
- `gap-6` = 24px (6 × 4px)
- `gap-8` = 32px (8 × 4px)
- `gap-12` = 48px (12 × 4px)

### Section Spacing
- **Component spacing**: `space-y-3` (12px between elements)
- **Section spacing**: `space-y-6` (24px between sections)
- **Major section spacing**: `space-y-20` (80px between major sections)

### Padding Standards
- **Small components**: `px-3 py-2` (12px horizontal, 8px vertical)
- **Medium components**: `px-4 py-2.5` (16px horizontal, 10px vertical)
- **Large components**: `px-6 py-12` (24px horizontal, 48px vertical)
- **Cards**: `p-6` or `p-12` (24px or 48px all around)

### Margin Standards
- **Component margins**: `mb-8`, `mb-10`, `mb-12` (32px, 40px, 48px)
- **Section margins**: `mb-16`, `mb-20` (64px, 80px)
- **Hero margins**: `mb-32` (128px on desktop)

## Layout System

### Container Widths
```css
--container-lg: 32rem    /* 512px */
--container-xl: 36rem    /* 576px */
--container-2xl: 42rem   /* 672px */
--container-4xl: 56rem   /* 896px */
```

### Grid System
- **Main container**: `max-w-4xl mx-auto px-6`
- **Two-column**: `grid-cols-1 md:grid-cols-2`
- **Three-column**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Twelve-column**: `grid-cols-1 md:grid-cols-12` (for complex layouts)

### Responsive Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

## Component Standards

### Buttons

#### Primary Button
```tsx
<Button className="bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all rounded px-6 h-12 text-base font-medium group">
  Join Build Crew <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
</Button>
```

#### Secondary Button
```tsx
<button className="bg-[#1c1c1c] border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-white px-4 py-2 rounded text-xs font-medium transition-all">
  Connect with GitHub
</button>
```

### Cards

#### Standard Card
```tsx
<div className="border border-neutral-800 bg-[#111] p-12 rounded-lg">
  {/* Card content */}
</div>
```

#### Nested Card
```tsx
<div className="border border-neutral-800 bg-[#0A0A0A] p-6 rounded text-sm text-neutral-400">
  {/* Nested content */}
</div>
```

### Icons
- **Size**: `w-4 h-4` (16px) for inline icons, `w-5 h-5` (20px) for standalone
- **Color**: `fill-current` or `text-red-500` for brand color
- **Transitions**: `transition-transform group-hover:translate-x-1` for interactive icons

## Interactive States

### Hover Effects
- **Buttons**: `hover:bg-neutral-200` + `hover:scale-[1.02]`
- **Cards**: `hover:border-neutral-700`
- **Links**: `hover:text-white` + `hover:underline`
- **Icons**: `group-hover:translate-x-1`

### Active States
- **Buttons**: `active:scale-[0.98]`

### Focus States
- **Inputs**: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Buttons**: `focus-visible:ring-[3px]`

### Transitions
```css
transition-all      /* For complex state changes */
transition-colors   /* For color changes only */
transition-transform /* For scale/translate effects */
```

## Border Radius System

```css
--radius: 0.625rem /* 10px - Primary radius */
```

- **Small**: `rounded` (4px)
- **Medium**: `rounded-md` (6px)
- **Large**: `rounded-lg` (10px)
- **Full**: `rounded-full` (circular)

## White Space Guidelines

### Vertical Rhythm
- Use consistent spacing multiples of 4px
- Maintain visual hierarchy through spacing relationships
- Larger spacing between unrelated sections
- Smaller spacing between related elements

### Content Spacing
- **Paragraph spacing**: `mb-8` to `mb-12`
- **List item spacing**: `gap-2` to `gap-3`
- **Section spacing**: `py-16 md:py-24`
- **Hero spacing**: `py-12 md:py-24`

## Accessibility Standards

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Use semantic color variables for consistency

### Focus Management
- Visible focus indicators on all interactive elements
- Logical tab order through content
- Skip links for keyboard navigation

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic sectioning elements (`<section>`, `<header>`, `<footer>`)
- Descriptive link text and button labels

## Implementation Guidelines

### CSS Custom Properties
Always use CSS custom properties for:
- Colors (semantic naming)
- Spacing values
- Typography scales
- Border radius values

### Utility Classes
Prefer Tailwind utility classes for:
- Layout and positioning
- Spacing and sizing
- Typography styling
- Color application

### Component Composition
- Use the `cn()` utility for conditional classes
- Extend base component variants rather than overriding
- Maintain consistent prop interfaces across similar components

### Performance Considerations
- Use `transition-colors` instead of `transition-all` when only colors change
- Implement hover states with `@media (hover: hover)` for touch devices
- Optimize font loading with system font fallbacks

## Brand Elements

### Logo Treatment
- Red Zap icon (`text-red-500 fill-current`)
- White "Amp" text with tight tracking
- Consistent sizing: `w-5 h-5` for icon, standard text sizing for wordmark

### Selection Styling
```css
selection:bg-red-500/30 /* Red selection highlight at 30% opacity */
```

### Visual Hierarchy
1. **Hero section**: Largest text, maximum contrast
2. **Section headings**: Serif italic, medium size
3. **Component headings**: Bold sans-serif
4. **Body text**: Light weight, good readability
5. **Supporting text**: Reduced opacity, smaller size

This design guide should be referenced for all new components and features to maintain visual consistency across the application.