# Gemini AI Question Bank

A full-stack, AI-assisted assessment authoring platform built for Cloudflare Pages and Workers. The system combines React, Tailwind CSS, Supabase, and Google Gemini to transform source documents into curated private or open question banks with role-aware controls and a granular credit system.

## Features

- **AI Extraction** – Upload PDF, DOCX, TXT, or XLSX files and let Gemini generate multi-choice questions, answers, and explanations.
- **Role-Based Workspace** – Level 1 users author their own content, Level 2 moderators manage shared libraries, and Level 3 admins orchestrate credits, roles, and policies.
- **Credit Ledger** – Track allocations and consumption per AI action with admin-configurable limits and automatic blocking when balances run out.
- **Question Bank Management** – CRUD for questions and sets, visibility toggles, tagging, difficulty/category metadata, merging, duplication, and exports (CSV, PDF, DOCX).
- **Glassmorphism UI** – Modern shadcn-inspired components with dashboards, async indicators, and analytics.
- **Cloud Native** – Designed for Cloudflare Pages deploys, using Supabase for authentication, PostgreSQL, and storage.

## Project Structure

```
├─ functions/              # Cloudflare Pages Functions (API)
│  ├─ _lib/                # Shared utilities (auth, response helpers, credits)
│  ├─ ai/                  # Gemini extraction + status polling
│  ├─ auth/                # Role lookup, user listing, role updates
│  ├─ credits/             # Credit ledger management
│  ├─ questions/           # Question + set CRUD endpoints
│  └─ storage/             # Supabase storage signed URL helpers
├─ src/                    # React + Vite frontend
│  ├─ components/          # UI, dashboard, question, and settings modules
│  ├─ context/             # Auth + credit context providers
│  ├─ pages/               # Router pages (Dashboard, Questions, Settings, etc.)
│  ├─ services/            # API, Supabase, AI abstractions
│  └─ utils/               # Constants, formatters, validation schemas
├─ db/
│  ├─ schema.sql           # PostgreSQL schema for Supabase
│  └─ seed.sql             # Optional seed data for local development
├─ docs/
│  ├─ developer.md         # Build, deployment, and API reference
│  ├─ user.md              # End-user onboarding guide
│  └─ admin.md             # Role + credit administration playbook
├─ package.json            # Vite tooling + dependencies
├─ tailwind.config.js      # Tailwind theme (glassmorphism presets)
└─ vite.config.js          # Vite bundler configuration
```

## Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- A [Supabase](https://supabase.com/) project with Google OAuth enabled
- A [Google AI Studio](https://ai.google.dev/) Gemini API key
- Cloudflare Pages project (for production deployments)

## Environment Variables

Create a `.env` (for local Vite dev) and configure Cloudflare Pages → Settings → Environment Variables.

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `VITE_SUPABASE_STORAGE_BUCKET` | Storage bucket for uploads (default `question-files`) |
| `VITE_AI_EXTRACTION_COST` | Frontend display of per-extraction credits (default `5`) |
| `VITE_REVIEW_CREDIT_COST` | Frontend display of moderator review credits (default `2`) |
| `SUPABASE_URL` | Supabase project URL for Cloudflare Workers |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key for privileged operations |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (default `question-files`) |
| `DEFAULT_STARTING_CREDITS` | Credits allocated to new accounts (default `50`) |
| `AI_EXTRACTION_CREDIT_COST` | Credits deducted per AI extraction (default `5`) |
| `AI_RATE_LIMIT_PER_MINUTE` | Optional rate limit for AI calls (default `5`) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Optional Gemini model (default `models/gemini-1.5-flash`) |

> **Tip:** Configure Google OAuth Redirect URLs in Supabase Auth → Providers to include both `http://localhost:5173` and your Cloudflare Pages domain.

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies API calls to `/api/*`, handled by Cloudflare Functions.

### Testing API Endpoints Locally

Cloudflare Pages Functions can be tested with [`wrangler pages dev`](https://developers.cloudflare.com/pages/functions/local-development/) after setting environment variables:

```bash
npx wrangler pages dev --local --binding SUPABASE_URL=... --binding SUPABASE_SERVICE_ROLE_KEY=...
```

## Database Setup

1. Enable the `pgcrypto` extension in Supabase.
2. Run `db/schema.sql` in the SQL editor to create tables, policies, and indexes.
3. Optionally execute `db/seed.sql` to populate sample users, question sets, and questions for demos.

## Deployment

1. Commit changes and push to your repository.
2. Connect the repo to Cloudflare Pages.
3. In “Build settings,” set the build command to `npm run build` and output directory to `dist`.
4. Configure the environment variables listed above for production.
5. Trigger a deploy—Cloudflare will host the React app and expose the API under `/api/*`.

## Documentation

Detailed guides live under `docs/`:

- [`docs/user.md`](docs/user.md) – onboarding, dashboard tour, file uploads, and question management.
- [`docs/admin.md`](docs/admin.md) – credit management, role delegation, and AI oversight.
- [`docs/developer.md`](docs/developer.md) – architecture, development workflow, endpoint catalogue, and deployment recipes.

---

For questions or improvements, open an issue or extend the documentation in `docs/`.
