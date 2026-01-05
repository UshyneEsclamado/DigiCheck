# 🎨 Enrollment Management - Quick Style Reference

## Colors

### Primary Palette

```css
--green-primary: #3d8d7a --green-dark: #2d6a5a --green-darker: #1e4d3f --cyan-primary: #06b6d4
  --cyan-dark: #0891b2 --blue-primary: #0369a1 --red-primary: #dc2626 --red-dark: #ef4444;
```

### Neutrals

```css
--gray-50: #f8fafc --gray-100: #f1f5f9 --gray-200: #e2e8f0 --gray-300: #cbd5e1 --gray-400: #94a3b8
  --gray-500: #64748b --gray-600: #475569 --gray-900: #1e293b;
```

## Typography

### Font Family

```css
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
```

### Font Sizes

```css
--text-xs: 0.6875rem /* 11px */ --text-sm: 0.75rem /* 12px */ --text-base: 0.8125rem /* 13px */
  --text-md: 0.875rem /* 14px */ --text-lg: 0.9375rem /* 15px */ --text-xl: 1.0625rem /* 17px */
  --text-2xl: 1.125rem /* 18px */ --text-3xl: 1.75rem /* 28px */;
```

### Font Weights

```css
--weight-normal: 400 --weight-medium: 500 --weight-semibold: 600 --weight-bold: 700
  --weight-extrabold: 800;
```

## Spacing Scale

```css
--space-1: 0.625rem /* 10px */ --space-2: 0.875rem /* 14px */ --space-3: 1rem /* 16px */ --space-4:
  1.25rem /* 20px */ --space-5: 1.5rem /* 24px */;
```

## Border Radius

```css
--radius-sm: 8px --radius-md: 10px --radius-lg: 12px --radius-xl: 16px --radius-2xl: 20px;
```

## Shadows

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08) --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.05) --shadow-lg:
  0 6px 16px rgba(color, 0.35) --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.3);
```

## Gradients

### Backgrounds

```css
--gradient-page: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%) --gradient-green:
  linear-gradient(135deg, #3d8d7a, #2d6a5a) --gradient-cyan:
  linear-gradient(135deg, #06b6d4, #0891b2) --gradient-red:
  linear-gradient(135deg, #ef4444, #dc2626) --gradient-blue:
  linear-gradient(135deg, #dbeafe, #bfdbfe) --gradient-panel:
  linear-gradient(135deg, #fafbfc, #ffffff);
```

## Animations

### Timing Functions

```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1) --ease-in: ease-in --ease-out: ease-out;
```

### Duration

```css
--duration-fast: 0.2s --duration-normal: 0.3s --duration-slow: 0.5s;
```

## Component Sizes

### Avatars

```css
--avatar-size: 40px --avatar-radius: 10px;
```

### Buttons

```css
--btn-padding: 0.6875rem 1.125rem --btn-radius: 10px --btn-font-size: 0.875rem --btn-font-weight:
  700;
```

### Inputs

```css
--input-padding: 0.625rem 0.875rem --input-radius: 10px --input-border: 2px solid #e2e8f0
  --input-font-size: 0.875rem;
```

### Panels

```css
--panel-height: calc(100vh - 420px) --panel-min-height: 400px --panel-max-height: 520px
  --panel-radius: 16px --panel-border: 2px solid #e2e8f0;
```

## Scrollbars

### Main Page

```css
width: 12px
track-bg: #e2e8f0
thumb-gradient: linear-gradient(180deg, #3D8D7A, #2d6a5a)
thumb-border: 3px solid #e2e8f0
```

### Student Lists

```css
width: 10px
track-bg: #f1f5f9
thumb-gradient: linear-gradient(180deg, #cbd5e1, #94a3b8)
thumb-border: 2px solid #f1f5f9
```

### Modals

```css
width: 8px
track-bg: #f1f5f9
thumb-gradient: linear-gradient(180deg, #cbd5e1, #94a3b8)
```

## Breakpoints

```css
--mobile: 480px --tablet: 768px --desktop: 1200px --desktop-lg: 1400px;
```

## Usage Examples

### Button

```vue
<button class="btn-primary">
  <svg>...</svg>
  Enroll Selected
</button>
```

### Student Item

```vue
<div class="student-item" :class="{ selected: isSelected }">
  <div class="student-avatar">JD</div>
  <div class="student-info">
    <div class="student-name">Doe, John</div>
    <div class="student-meta">
      <span class="student-id">2024001</span>
      <span class="separator">•</span>
      <span class="grade-badge">Grade 7</span>
    </div>
  </div>
</div>
```

### Panel

```vue
<div class="students-panel">
  <div class="panel-header">
    <div class="panel-title">
      <svg>...</svg>
      <h2>Available Students</h2>
    </div>
    <span class="count-badge">42</span>
  </div>
  <div class="panel-controls">...</div>
  <div class="students-list">...</div>
  <div class="panel-actions">...</div>
</div>
```

## Best Practices

### 1. Always use spacing scale

```css
✅ padding: var(--space-4)
❌ padding: 18px
```

### 2. Use semantic color names

```css
✅ color: var(--green-primary)
❌ color: #3D8D7A
```

### 3. Apply consistent animations

```css
✅ transition: all 0.2s var(--ease-smooth)
❌ transition: all 0.3s ease
```

### 4. Maintain hierarchy

```css
✅ z-index: 1, 10, 100, 1000, 9999
❌ z-index: 5, 7, 15, 23
```

### 5. Use gradients consistently

```css
✅ background: var(--gradient-green)
❌ background: linear-gradient(...)
```

## Quick Copy Snippets

### Gradient Button

```css
background: linear-gradient(135deg, #3d8d7a, #2d6a5a);
padding: 0.6875rem 1.125rem;
border-radius: 10px;
font-weight: 700;
box-shadow: 0 2px 8px rgba(61, 141, 122, 0.25);
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Card Container

```css
background: white;
border-radius: 16px;
border: 2px solid #e2e8f0;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
padding: 1.25rem 1.5rem;
```

### Visible Scrollbar

```css
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e1, #94a3b8);
  border-radius: 8px;
  border: 2px solid #f1f5f9;
}
```

### Hover Effect

```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.35);
}
```

---

**Reference Version**: 1.0  
**Last Updated**: January 5, 2026  
**Compatibility**: All modern browsers
