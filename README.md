PRiSM

Overview

PRiSM is an AI-powered engineering design studio built with Next.js, TypeScript, and TailwindCSS.
It enables engineers to describe projects in natural language and automatically generate structured specifications, circuit diagrams, CAD mockups, simulation placeholders, BOMs, and exportable documentation.

The system is designed with modular architecture, clean UI/UX, and extensibility in mind. It currently integrates OpenAI NLP with stubs for CAD and simulation APIs, and includes deterministic mock data pipelines for demonstration.

Features
Project Management

Grid-based landing page with project creation and persistence.

Dynamic routing to /project/[id] workspaces.

Sidebar navigation for all engineering modules.

Command Prompt (AI Integration)

Integrated with OpenAI GPT via OPENAI_API_KEY.

Converts free-text project descriptions into structured specifications.

Debounced recompute flow updates all sections when variables change.

Circuits

Keyword detection in prompts (e.g., Arduino, Raspberry Pi, ESP32) displays mapped circuit diagrams.

Random fallback images when no keyword match is found.

Placeholder mapping to Wokwi JSON format (diagram.json, sketch.ino, wokwi.toml).

CAD Models

Stubbed Zoo API integration for 3D model generation.

Backend contains a pool of 6–7 mock CAD files (STEP/GLB/OBJ).

Download buttons available for export-ready files.

CFD / Simulation

Stubbed SimScale API integration for stress, strain, and thermal data.

Deterministic JSON results provide structured metrics.

Visual placeholders embedded into the Simulation section.

Generated Code

Syntax-highlighted code viewer with copy and download support.

Backend stubs for multiple languages (C, C++, Python, Rust).

Mock files delivered based on parsed project spec.

Bill of Materials (BOM)

Fully functional searchable and sortable BOM table.

Fields: MPN, Description, Qty, Unit Price, Supplier, Alternatives.

Includes total calculation and CSV export.

Risk Analysis & Testing Methods

Risk analysis cards with severity indicators and mitigations.

Testing procedures with steps, required equipment, and notes.

User Manual & Documentation

Compiles outputs from Circuits and CAD into a structured manual.

PDF export functionality creates a ready-to-share report.

Clean layout with headings, warnings, and tools list.

Technical Stack

Framework: Next.js (App Router) + TypeScript

UI: TailwindCSS, shadcn/ui, framer-motion, lucide-react

AI Integration:

OpenAI GPT (OPENAI_API_KEY) for NLP-driven specification parsing

Zoo API stubs for CAD generation

SimScale API stubs for simulation results

Backend: Next.js API routes, Node runtime

Persistence: File-based mocks with environment-configurable ARTIFACT_ROOT

Artifacts: Wokwi CLI planned for circuit simulation integration

Environment Variables

Create a .env.local file with the following:

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

ZOO_API_KEY=...
SIMSCALE_API_KEY=...

ARTIFACT_ROOT=/tmp/projects

Current Status

Project management, AI prompt panel, Circuits, CAD, BOM, Risk, Testing, and User Manual are functional.

CSV export (BOM) and PDF export (User Manual) fully working.

Circuits and CAD sections pull deterministic mock data.

Backend prepared for real API integration (Zoo, SimScale, Wokwi).

Roadmap

Finalize Wokwi CLI integration for live Arduino simulation.

Connect Zoo API for real CAD generation.

Enable SimScale API for real-time simulations.

Expand code generation pipeline with more languages and richer test coverage.

Add authentication and multi-user project support.

Contribution

Contributions are welcome. The system is modular, and new APIs or exporters can be integrated by extending the backend /api routes and updating the workspace panels.

License

This project is released under the MIT License.
