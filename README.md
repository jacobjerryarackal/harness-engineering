# Symphony

**Autonomous Harness Operating System**

> A model-agnostic engineering orchestration platform that coordinates specialized engineering harnesses, shares platform-wide organizational memory, and continuously improves through closed-loop production telemetry.

---

## Live Demo

| Component | URL |
| :--- | :--- |
| **Frontend UI** | [https://harness-engineering-murex.vercel.app](https://harness-engineering-murex.vercel.app) |
| **Backend API** | [https://symphony-os.onrender.com](https://symphony-os.onrender.com) |
| **Swagger API Docs** | [https://symphony-os.onrender.com/docs](https://symphony-os.onrender.com/docs) |

---

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            SYMPHONY DEMO PREVIEW                                │
│                                                                                  │
│   [ Intent Input ] ──► [ Control Plane ] ──► [ Harness Pipeline ] ──► [ Learn ] │
│                                                                                  │
│   (See interactive demo at http://localhost:3000 during live server execution)   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

| Feature | Description |
| :--- | :--- |
| **Harness-First Orchestration** | Replaces monolithic coding prompts with single-responsibility engineering harnesses. |
| **Shared Core Services** | Maintains organizational state, session variables, policies, facts, and evidence across runs. |
| **Closed-Loop Feedback** | Converts production runtime failures into structured knowledge triples (*"Loss becomes Information"*). |
| **Full Stack Control Plane** | High-performance FastAPI backend paired with an interactive Next.js / React Flow visualizer. |

---

## Why Symphony?

### The Problem with Monolithic Coding Agents

Modern Large Language Models (LLMs) excel at isolated code generation, but struggle with comprehensive software lifecycle execution. 

Standard coding agents suffer from fundamental structural limitations:

1. **Context Degradation & Prompt Pollution**: Attempting to specify requirements, research libraries, design architecture, generate code, write tests, and configure deployments in a single prompt window leads to context overflow and hallucinated APIs.
2. **Open-Loop Execution**: Traditional AI tools generate code and terminate. They do not run the generated code in target runtimes, collect operational telemetry, or learn from production failures.
3. **Transient Knowledge**: Engineering learnings, test outcomes, and failure post-mortems disappear when a chat session ends. Every new request restarts reasoning from scratch.
4. **Lack of Domain Isolation**: Code generation logic is coupled with architectural planning and test verification, preventing independent optimization of individual software engineering disciplines.

### The Solution: An Autonomous Harness Operating System

Symphony decouples engineering intent orchestration from underlying LLM inference. It introduces a **Control Plane** that routes intent through specialized **Engineering Harnesses**, enforces organizational policies, records evidence, and applies closed-loop production feedback to shared memory services.

---

## Architecture

### High-Level Design (HLD)

![High-Level Design](docs/architecture/hld.png)

The High-Level Architecture consists of five core layers:

* **External World**: Captures raw engineering requests, requirements, business constraints, and telemetry signals.
* **Symphony Control Plane (`core.orchestrator.SymphonyOrchestrator`)**: Coordinates pipeline execution without directly generating raw software artifacts.
* **Harness Layer (`harnesses.*`)**: Domain-specific harnesses performing specialized engineering tasks.
* **Shared Core Services (`memory.*`)**: Persistent platform services providing shared intelligence across all executions.
* **Production Runtime (`runtime.*`)**: Executes generated artifacts, captures operational telemetry, and drives continuous learning.

### Low-Level Design (LLD)

![Low-Level Design](docs/architecture/lld.png)

The Control Plane executes incoming goals through a deterministic 7-stage pipeline:

```text
Incoming Goal Request
        │
        ▼
[ 1. Intent Analyzer ] ─── Parses intent type and identifies required engineering domains
        │
        ▼
[ 2. Harness Router ] ──── Orders domains into standard engineering pipeline sequence
        │
        ▼
[ 3. Harness Selector ] ── Queries Harness Registry for active domain implementations
        │
        ▼
[ 4. Execution Planner ] ─ Builds linear strategy plan (ExecutionPlan)
        │
        ▼
[ 5. Context Manager ] ─── Assembles session variables, workspace state, policies & graph facts
        │
        ▼
[ 6. Execution Engine ] ── Sequentially executes harnesses, logs traces & propagates state
        │
        ▼
[ 7. Response Aggregator ] Consolidates generated files, test logs & deployment statuses
```

### Component Architecture

* **Symphony Control Plane**: Decouples orchestration from LLM providers, ensuring model-agnostic execution.
* **Harness Registry (`harnesses.registry.HarnessRegistry`)**: Maintains registered capabilities across 7 engineering domains:
  1. `SpecificationHarness`: Acceptance criteria & requirements generation
  2. `ResearchHarness`: Technical pattern & dependency investigation
  3. `ArchitectureHarness`: System blueprint & component schema design
  4. `EngineeringHarness`: Production application code generation
  5. `EvaluationHarness`: Automated test suite execution & verification
  6. `DeploymentHarness`: Release packaging & runtime deployment
  7. `LearningHarness`: Post-mortem failure analysis & update generation
* **Shared Core Services**: 7 platform memory components accessible by all harnesses:
  - `MemoryService`: Execution traces and step logs
  - `ContextService`: Active session variables
  - `StateService`: Workspace component state
  - `KnowledgeGraphService`: Semantic RDF-style facts (`subject-predicate-object`)
  - `EvidenceStoreService`: Hard evidence storage (test outputs, code artifacts)
  - `FailureRepository`: Failure incidents and stack traces
  - `PolicyEngineService`: Engineering compliance rules
* **Runtime Learning Loop**: Converts operational feedback into organizational memory:

```text
Execution Artifacts ──► Production Runtime ──► Telemetry Collector ──► Knowledge Extractor
                                                                             │
Shared Core Services ◄── Memory Updater ◄── Learning Engine ◄────────────────┘
```

---

## Execution Pipeline

Symphony coordinates engineering requests through a structured execution pipeline. The interactive React Flow visualization mirrors this backend pipeline in real time, animating step progression as work flows through the system.

### Stage Overview

1. **Intent Analyzer**: Parses the user request text to identify core engineering goals and extract required engineering domains.
2. **Harness Router**: Sorts identified domains into standard software lifecycle order (`SPECIFICATION` → `RESEARCH` → `ARCHITECTURE` → `ENGINEERING` → `EVALUATION`).
3. **Harness Selector**: Looks up active domain harnesses registered in the `HarnessRegistry`.
4. **Execution Planner**: Generates a linear strategy plan (`ExecutionPlan`) detailing step IDs and parameters.
5. **Harness Execution**: Sequentially executes participating engineering harnesses. **Only harnesses selected by the orchestration engine participate and execute**; unselected harnesses remain idle.
6. **Deployment**: Packages compiled code artifacts and triggers target runtime deployment simulation.
7. **Learning**: Evaluates execution outcomes, identifies failure events, and formulates knowledge updates.
8. **Telemetry**: Collects process exit codes, CPU metrics, and execution log streams.
9. **Knowledge Graph**: Persists extracted facts as semantic triples (`subject-predicate-object`) in the platform knowledge graph.
10. **Memory Update**: Commits updates to shared memory, failure repositories, and evidence stores to enrich future runs.

> **Real-Time Visualizer Note**: In the frontend React Flow graph, nodes transition from **Gray (Idle)** → **Yellow (Running)** → **Green (Success)** / **Red (Failed)** in real time based strictly on backend API response payload fields (`selected_harnesses` and `execution_plan`). Unused harnesses never animate to green.

---


## Screenshots

### 1. Control Plane Realtime Flow (`/execute`)
*Interactive React Flow graph animating live control plane execution across intent analysis, routing, harness delegation, and learning updates.*

### 2. Semantic Knowledge Graph Inspector (`/knowledge-graph`)
*Inspects stored semantic facts and triples (`subject-predicate-object`) accumulated across executions.*

### 3. Production Telemetry & Metrics (`/telemetry`)
*Monitors runtime execution status, exit codes, CPU utilization metrics, and operational logs.*

### 4. Shared Memory & Context Inspector (`/memory`)
*Displays active session variables, project workspace state, and execution trace history.*

---

## Technical Features

* **Model Agnostic**: Pure Python orchestrator independent of specific model providers or vendor APIs.
* **Harness-First Design**: Modular harness architecture enforcing single-responsibility engineering standards.
* **Closed-Loop Learning**: Automated translation of runtime failure logs into persistent Knowledge Graph triples.
* **FastAPI Backend**: Asynchronous REST API with Pydantic V2 schemas and structured error handling.
* **Next.js 15 Frontend**: Modern web dashboard with dark-mode aesthetic, live React Flow graphs, and tabbed view state.
* **React Flow Visualizer**: Real-time visual tracking of Control Plane node states (`running`, `success`, `failure`).
* **Structured Telemetry**: Full capture of execution logs, process exit codes, and operational metrics.
* **Semantic Knowledge Graph**: In-memory RDF triple store with pattern querying capabilities.

---

## Repository Structure

```text
Symphony/
├── README.md                           # Project overview & quick start guide
├── SYSTEM_DESIGN.md                    # Detailed technical architecture specification
├── pytest.ini                          # Pytest root configuration
├── requirements.txt                    # Python dependencies
│
├── app/                                # FastAPI Web Application Layer
│   ├── main.py                         # Application entrypoint (CORS, Lifespan handler)
│   ├── dependencies.py                 # Singleton Container dependency injection
│   ├── routers/
│   │   ├── execute.py                  # POST /execute (Main orchestration pipeline)
│   │   ├── memory.py                   # GET /memory, /knowledge-graph, /failures, /telemetry
│   │   └── health.py                   # GET /health
│   └── schemas/
│       └── schemas.py                  # Pydantic V2 request & response models
│
├── core/                               # Symphony Control Plane Core
│   ├── orchestrator.py                 # SymphonyOrchestrator main pipeline
│   ├── interfaces.py                   # Dataclasses (Intent, ExecutionPlan, HarnessResult)
│   ├── intent_analyzer.py              # PatternIntentAnalyzer keyword intent parser
│   ├── harness_router.py               # DomainHarnessRouter sequential ordering
│   ├── harness_selector.py             # RegistryHarnessSelector lookup
│   ├── execution_planner.py            # SequentialExecutionPlanner strategy
│   ├── context_manager.py              # PlatformContextManager context assembly
│   ├── execution_engine.py             # Engine sequential step execution
│   └── response_aggregator.py          # ArtifactAggregator output consolidation
│
├── harnesses/                          # Specialized Engineering Harnesses
│   ├── base.py                         # Abstract Harness base class
│   ├── registry.py                     # HarnessRegistry domain mapping
│   └── [specification, research, architecture, engineering, evaluation, deployment, learning].py
│
├── memory/                             # Shared Core Services
│   └── [memory, context, state, knowledge_graph, evidence_store, failure_repository, policy_engine].py
│
├── runtime/                            # Production Runtime & Feedback Loop
│   └── [production, telemetry, knowledge_extraction, learning_engine, memory_update].py
│
├── frontend/                           # Next.js 15 Web Dashboard
│   └── src/
│       ├── app/                        # Next.js App Router pages
│       ├── components/                 # React Flow visualizer & view modules
│       └── lib/                        # API fetch client (`lib/api.ts`)
│
└── tests/                              # Automated Pytest Suite
    └── [test_api, test_harnesses, test_memory, test_orchestrator, test_runtime].py
```

---

## Environment Variables

### Backend Configuration (`.env`)

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | Port number for Uvicorn ASGI server | `8000` | No |
| `HOST` | Bind network host interface | `0.0.0.0` | No |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins allowed to invoke API | `http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000` | No |

### Frontend Configuration (`frontend/.env.local`)

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public API URL for FastAPI Control Plane backend | `http://127.0.0.1:8000` | Yes (Production) |

---

## Quick Start & Local Development

### Prerequisites

* Python 3.10+
* Node.js 18+ & npm

### 1. Backend Setup

Clone the repository and set up environment:

```bash
git clone https://github.com/jacobjerryarackal/harness-engineering.git
cd harness-engineering

# Copy example environment file
cp .env.example .env

# Install Python requirements
pip install -r requirements.txt
```

Run the automated test suite:

```bash
pytest
```

Start the Uvicorn ASGI dev server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be live at `http://127.0.0.1:8000`. Access interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

In a separate terminal, set up and run the Next.js interface:

```bash
cd frontend

# Copy example environment file
cp .env.example .env.local

# Install Node dependencies
npm install

# Launch Next.js dev server
npm run dev
```

Open `http://localhost:3000` in your web browser to launch the Symphony Control Plane interface.

---

## Production Deployment

### 1. Backend Deployment (Railway)

Symphony's FastAPI backend can be deployed to Railway in minutes:

1. Create a new project on [Railway](https://railway.app/).
2. Select **Deploy from GitHub repo** and select `harness-engineering`.
3. Set the **Start Command**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Configure Railway **Environment Variables**:
   * `ALLOWED_ORIGINS`: `https://your-symphony-frontend.vercel.app`
   * `PORT`: `8000` (or leave default assigned by Railway)
5. Copy your deployed Railway backend URL (e.g. `https://symphony-api-production.up.railway.app`).

### 2. Frontend Deployment (Vercel)

Symphony's Next.js dashboard is optimized for deployment on Vercel:

1. Import the repository into [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `frontend`.
3. Configure Vercel **Environment Variables**:
   * `NEXT_PUBLIC_API_URL`: `https://symphony-api-production.up.railway.app` (your deployed Railway backend URL)
4. Click **Deploy**.
5. Once deployed, update the backend's `ALLOWED_ORIGINS` on Railway to include your production Vercel URL.


---

## Execution Example

### Request

Submit an engineering goal to the `/execute` API endpoint:

```bash
curl -X POST "http://127.0.0.1:8000/execute" \
     -H "Content-Type: application/json" \
     -d '{
           "request_text": "Write spec, research architecture, implement and test a Python module",
           "run_id": "demo-run-01"
         }'
```

### Response

```json
{
  "run_id": "demo-run-01",
  "success": true,
  "intent": {
    "intent_type": "SPECIFICATION_TASK",
    "required_domains": [
      "SPECIFICATION",
      "RESEARCH",
      "ARCHITECTURE",
      "ENGINEERING",
      "EVALUATION"
    ]
  },
  "selected_harnesses": [
    "SPECIFICATION",
    "RESEARCH",
    "ARCHITECTURE",
    "ENGINEERING",
    "EVALUATION"
  ],
  "execution_plan": [
    { "step_id": "step_1_specification", "domain": "SPECIFICATION" },
    { "step_id": "step_2_research", "domain": "RESEARCH" },
    { "step_id": "step_3_architecture", "domain": "ARCHITECTURE" },
    { "step_id": "step_4_engineering", "domain": "ENGINEERING" },
    { "step_id": "step_5_evaluation", "domain": "EVALUATION" }
  ],
  "execution_artifacts": {
    "generated_files": {
      "module.py": "# Generated production implementation module",
      "spec.md": "# Engineering Specification Document"
    },
    "test_results": {
      "passed": 4,
      "failed": 0
    },
    "deployment_status": "READY"
  },
  "telemetry_summary": {
    "run_id": "demo-run-01",
    "status": "RUNNING",
    "exit_code": 0,
    "logs": [
      "Deploying artifacts for run: demo-run-01",
      "Executing script: module.py",
      "All scripts executed successfully in production."
    ],
    "metrics": {
      "cpu_utilization": 12.4
    }
  },
  "learning_updates": [
    {
      "action": "ADD_TRIPLE",
      "subject": "Run:demo-run-01",
      "predicate": "deployed_successfully",
      "obj": "StableStatus",
      "metadata": { "type": "runtime_success" }
    }
  ]
}
```

---

## Design Principles

* **Harness First**: Engineering capabilities are structured as isolated, testable modules rather than monoliths.
* **Evidence-Driven**: Every output must generate verifiable evidence before entering production runtime.
* **Organizational Memory**: Knowledge gained in one run is preserved to optimize subsequent engineering tasks.
* **Human-AI Collaboration**: Clear control plane state visibility allows engineers to inspect, approve, and direct autonomous execution.

---

## Roadmap

- [ ] **Dynamic Harness Discovery**: Dynamic registration of external third-party harness plugins.
- [ ] **Multi-Agent Cross-Harness Parallelization**: Asynchronous parallel step execution for independent domains.
- [ ] **Distributed Runtime Execution**: Remote runtime worker execution across Kubernetes clusters.
- [ ] **Human-in-the-Loop Approval Gates**: Interactive approval checkpoints prior to deployment harness invocation.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.