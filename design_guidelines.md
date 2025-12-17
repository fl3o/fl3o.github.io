# Design Guidelines: Ratio Master Calculator

## Design Approach
**System Selected**: Material Design-inspired data dashboard
**Rationale**: Utility-focused tool requiring clear data hierarchy, strong form patterns, and effective data visualization. Emphasis on readability, quick calculations, and actionable insights.

## Typography
- **Headings**: Inter or Roboto, weights 600-700
  - H1: 2.5rem (page title)
  - H2: 2rem (section headers)
  - H3: 1.5rem (card titles)
- **Body**: Regular weight 400, size 1rem
- **Data/Numbers**: Tabular figures, weight 500-600, size 1.25-2rem for key metrics
- **Labels**: Uppercase, 0.875rem, weight 500, letter-spacing wide

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Section padding: py-12 to py-20
- Card padding: p-6 to p-8
- Form spacing: gap-4 to gap-6
- Grid gaps: gap-6 to gap-8

## Component Library

### Dashboard Layout
- **Container**: max-w-7xl mx-auto px-4
- **Grid System**: 3-column desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- **Primary Stats Card**: Full-width hero card displaying current ratio with large typography
- **Calculator Section**: 2-column split (input form + live results)

### Navigation
- **Top Bar**: Sticky header with app title, optional user stats summary, actions
- Simple horizontal navigation if multiple tools added later
- Mobile: Hamburger menu pattern

### Forms & Inputs
- **Input Fields**: Floating labels, outlined style
- **Number Inputs**: Right-aligned text for numerical data
- **Units Display**: Inline unit indicators (GB, TB) as suffix
- **Submit Button**: Primary, elevated style with subtle shadow

### Data Display Components

**Stat Cards**:
- Elevated cards with subtle shadow (shadow-md)
- Icon + Label + Large Number layout
- Color-coded borders for status (green=good ratio, yellow=warning, red=needs improvement)
- Compact: p-6, rounded-lg

**Ratio Display**:
- Prominent center card showing calculated ratio
- Format: "1.25" with "Upload/Download" label
- Large typography (text-4xl to text-6xl)
- Visual indicator (progress ring or gauge chart)

**Recommendations Panel**:
- List-based layout with icon bullets
- Priority indicators (high/medium/low urgency)
- Actionable items with specific numbers
- Examples: "Upload 25 GB more to reach 1.0 ratio"

**Goal Calculator**:
- Side-by-side input/output display
- Slider for target ratio selection (0.5 to 3.0)
- Real-time calculation of required upload
- Visual progress indicator

**Charts/Visualizations**:
- Line chart for ratio evolution over time
- Bar chart for upload/download comparison
- Use Chart.js or similar via CDN
- Card container: p-6, min-h-[300px]

### History Section
- **Table Layout**: Striped rows, hover states
- **Columns**: Date, Upload, Download, Ratio, Actions
- **Mobile**: Card-based stacked layout
- **Pagination**: Bottom-aligned, centered

### Overlays & Modals
- Add/Edit history entry modal
- Settings/preferences overlay
- Backdrop blur effect for modals

## Page Structure

**Main Dashboard** (single page application):
1. Hero Stats Card - Current ratio prominently displayed
2. Quick Calculator - 2-column: Input form (left) + Live results (right)
3. Recommendations Panel - Grid of actionable suggestions
4. Goal Calculator - Target ratio planner
5. Visual Analytics - Charts section (2-column grid on desktop)
6. History Table - Full-width data table

**Responsive Breakpoints**:
- Mobile (<768px): Single column, stacked cards
- Tablet (768-1024px): 2-column grids
- Desktop (>1024px): 3-column grids, side-by-side layouts

## Images
**No large hero images** - This is a utility dashboard where data takes priority. Use:
- Icons from Heroicons (CDN) for stats, recommendations, and navigation
- Chart visualizations for data representation
- Possible small illustrative icons for empty states

## Animations
Minimal, functional only:
- Number counter animations when ratio recalculates
- Smooth transitions on card hover (transform: scale(1.02))
- Chart animations on load (Chart.js default)

## Accessibility
- All inputs with visible labels
- ARIA labels on icon buttons
- Keyboard navigation for calculator
- High contrast ratios for number displays
- Focus indicators on interactive elements