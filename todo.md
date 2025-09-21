# Engineering Workspace Application - MVP Implementation

## Core Files to Create/Modify:

### 1. **src/pages/Index.tsx** - Landing Page
- Header with app name + "New Project" button
- Grid of Project Cards (title, date, status)
- Click navigation to /project/[id]

### 2. **src/pages/ProjectWorkspace.tsx** - Main Workspace
- Left vertical navigation (sticky) with 7 sections
- Main panel for active section content
- Top bar with project title + "Run/Recompute" button

### 3. **src/components/ProjectCard.tsx** - Project Card Component
- Display project info (title, date, status)
- Click handler for navigation

### 4. **src/components/workspace/LeftNavigation.tsx** - Navigation Sidebar
- 7 sections: Command Prompt, Circuits, CAD, CFD/Simulations, Working Code, BOM, Risk Analysis, Testing Methods, User Manual
- Active section highlighting

### 5. **src/components/workspace/sections/** - Section Components
- **CommandPrompt.tsx** - Source of truth with prompt input + variables
- **Circuits.tsx** - Schematic + simulation preview
- **CAD.tsx** - 3D viewer + STEP file download
- **CFD.tsx** - Simulation preview + metrics
- **WorkingCode.tsx** - File tree + code viewer
- **BOM.tsx** - Components table
- **RiskAnalysis.tsx** - Risk table with severity chips
- **TestingMethods.tsx** - Expandable procedure cards
- **UserManual.tsx** - Step-by-step documentation + PDF export

### 6. **src/lib/api.ts** - API Integration Layer
- Mock API functions for all services
- Compute dispatcher function

### 7. **src/App.tsx** - Updated routing
- Add project workspace route

### 8. **src/types/index.ts** - TypeScript definitions
- Project, Section, API response types

## Implementation Priority:
1. Basic routing and layout structure
2. Landing page with mock projects
3. Project workspace layout
4. Command prompt functionality
5. Individual section components
6. API integration layer
7. Polish and animations

## Key Features:
- Responsive design with shadcn/ui components
- Framer Motion animations
- Auto-recompute with debouncing
- Skeleton loaders during computation
- Error handling with inline alerts
- Mock mode for all APIs