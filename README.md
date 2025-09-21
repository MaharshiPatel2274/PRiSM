PRiSM

Overview

PRiSM is a Next.js + TypeScript platform designed to transform natural language project specifications into structured engineering artifacts.
The system provides an end-to-end workflow similar to Flux.ai, with modular panels for circuits, CAD, CFD, generated code, BOM, risk analysis, testing, and documentation.

The project emphasizes modular architecture, AI-powered prompt integration, and deterministic simulation workflows with mock fallbacks for demonstration.

Features Implemented So Far
Project Management

Landing page with grid layout for project cards.

Project creation with name persistence and routing to /project/[id].

Sidebar navigation for all engineering tools.

Command Prompt (AI-Driven)

Integrated with OpenAI GPT using OPENAI_API_KEY.

Converts free-text inputs into structured specifications.

Supports recompute on variable changes with debounce.

Circuits

Keyword-based image rendering (e.g., ESP32, Raspberry Pi, Arduino).

Random fallback circuit images when no keyword is found.

Future-ready Wokwi mapping (diagram.json, sketch.ino, wokwi.toml).

CAD

Stubs for Zoo API integration.

Pool of 6–7 mock CAD models returned randomly for demo purposes.

Export-ready file formats: STEP/GLB/OBJ.

CFD / Simulations

Stubs for SimScale API with mock JSON responses.

Returns deterministic metrics such as stress, strain, and temperature.

Embeds placeholder images for results.

Generated Code

Code viewer with syntax highlighting and export options.

Stubbed API routes for generating multi-language code files.

Bill of Materials (BOM)

Fixed implementation: working table with searchable/sortable fields.

Columns: MPN, Description, Qty, Unit Price, Supplier.

CSV export supported.

Risk Analysis & Testing Methods

Mock risk items with severity ratings (L/M/H) and mitigations.

Testing cards describing procedures and required equipment.

User Manual & PDF Export

Aggregates outputs from Circuits and CAD panels.

Generates a clean PDF export with images and documentation.

Technical Stack

Framework: Next.js (App Router), TypeScript

UI: TailwindCSS, shadcn/ui, lucide-react, framer-motion

AI:

OpenAI GPT (prompt → specification)

Zoo API (CAD stubs)

SimScale API (simulation stubs)

Backend: Next.js API routes, Node runtime

Persistence: File storage / SQLite with mocks

Artifacts: Wokwi CLI planned for live circuit simulation

Environment Variables

Create a .env.local file with the following keys:

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

ZOO_API_KEY=...
SIMSCALE_API_KEY=...

ARTIFACT_ROOT=/tmp/projects

Current Status

Core workspace (projects, prompts, sidebar) functional.

Circuits and CAD return deterministic mock data mapped from user prompts.

BOM, Risk, Testing, and User Manual sections are fully operational.

CSV and PDF exports verified.

Pending: Wokwi simulation integration, real Zoo + SimScale API connections, and expanded code generation.

Next Steps

Connect live Zoo and SimScale APIs.

Finalize Wokwi CLI integration for Arduino simulation.

Expand generated code coverage (Python, C++, Rust).

Add authentication and multi-user support.
