# PRiSM  

![PRiSM Logo](./PRiSM_Logo_D.jpg)  

## Overview  
**PRiSM** is an AI-powered engineering design studio built with **Next.js, TypeScript, and TailwindCSS**.  
It enables engineers to describe projects in natural language and automatically generate structured specifications, circuit diagrams, CAD mockups, simulation placeholders, BOMs, and exportable documentation.  

The system is modular, production-ready, and integrates **OpenAI GPT** with deterministic mock data pipelines for CAD and simulation, while maintaining extensibility for live API integrations.  

---

## Features  

### Project Management  
- Grid-based landing page with project creation and persistence.  
- Dynamic routing to `/project/[id]` workspaces.  
- Sidebar navigation for all engineering modules.  

### Command Prompt (AI Integration)  
- Integrated with **OpenAI GPT** via `OPENAI_API_KEY`.  
- Converts free-text project descriptions into structured specifications.  
- Debounced recompute flow updates all sections when variables change.  

### Circuits  
- Keyword detection in prompts (e.g., *Arduino, Raspberry Pi, ESP32*) displays mapped circuit diagrams.  
- Random fallback images when no keyword match is found.  
- Placeholder mapping to **Wokwi JSON** format (`diagram.json`, `sketch.ino`, `wokwi.toml`).  

### CAD Models  
- Backend stubs for **Zoo API** with a pool of 6–7 mock CAD files.  
- Export-ready formats supported: STEP, GLB, OBJ.  
- Download buttons available for each generated model.  

### CFD / Simulation  
- Stubbed **SimScale API** integration for stress, strain, and thermal data.  
- Deterministic JSON results provide structured metrics.  
- Embedded placeholders for simulation previews.  

### Generated Code  
- Syntax-highlighted code viewer with copy and download support.  
- Backend stubs for multiple languages (C, C++, Python, Rust).  
- Mock files returned for demonstration.  

### Bill of Materials (BOM)  
- Fully functional searchable and sortable BOM table.  
- Fields: **MPN, Description, Qty, Unit Price, Supplier, Alternatives**.  
- Includes **total calculation** and **CSV export**.  

### Risk Analysis & Testing Methods  
- Risk analysis cards with severity indicators and mitigation strategies.  
- Test procedure cards with steps, required equipment, and documentation.  

### User Manual & Documentation  
- Compiles Circuits and CAD outputs into a structured user manual.  
- PDF export capability for clean, shareable documentation.  

---

## Technical Stack  

- **Framework**: Next.js (App Router) + TypeScript  
- **UI**: TailwindCSS, shadcn/ui, framer-motion, lucide-react  
- **AI Integration**:  
  - OpenAI GPT for NLP-driven specification parsing  
  - Zoo API stubs for CAD generation  
  - SimScale API stubs for simulation results  
- **Backend**: Next.js API routes, Node runtime  
- **Persistence**: File-based mocks with `ARTIFACT_ROOT`  
- **Artifacts**: Wokwi CLI planned for live Arduino simulation  

---

## Environment Variables  

Create a `.env.local` file with the following:  

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

ZOO_API_KEY=...
SIMSCALE_API_KEY=...

ARTIFACT_ROOT=/tmp/projects

