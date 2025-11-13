# Developer Guide

This guide explains the architecture, development workflow, and API catalogue for the Gemini AI Question Bank project.

## Architecture Overview

| Tier | Stack | Responsibilities |
| --- | --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, shadcn-inspired UI | Routing, dashboards, upload flows, question editing, role-aware UI guards |
| Backend | Cloudflare Pages Functions (Workers runtime) | Authentication wrappers, role checks, AI orchestration, credit enforcement, question CRUD |
| Data Platform | Supabase (PostgreSQL, Auth, Storage) | Google OAuth, persistent data, signed URL handling, audit logs |
| AI | Google Gemini (via `generativelanguage` API) | File-to-question extraction, fallback generation |

The frontend calls API routes under `/api/**`, which Cloudflare Pages maps to functions in `/functions/**`.

```
Browser → Vite SPA → /api/questions/* → Cloudflare Worker → Supabase + Gemini
```

## Local Development Workflow

1. Install dependencies and run the frontend dev server:
   ```bash
   npm install
   npm run dev
   ```
   The app runs at `http://localhost:5173`.

2. Start a local Pages Functions environment (optional but recommended):
   ```bash
   npx wrangler pages dev --local \
     --binding SUPABASE_URL=... \
     --binding SUPABASE_SERVICE_ROLE_KEY=... \
     --binding GEMINI_API_KEY=...
   ```

3. Create a `.env` file with Vite-specific variables (Supabase URL/key, optional AI costs). The functions runtime relies on Wrangler bindings or Cloudflare Pages env variables.

4. Update `db/schema.sql` in Supabase when schema changes; keep `db/seed.sql` aligned for sample content.

## Database Schema Summary

Tables defined in `db/schema.sql`:

- `users` – profile shadow table linked to Supabase auth UID. Tracks role and credit balance.
- `question_sets` – named collections of questions with privacy flags and tagging.
- `questions` – individual questions, metadata, MCQ options (`JSONB`), creator ownership.
- `ai_logs` – history of Gemini invocations, latency, and status, plus metadata payload.
- `credits_ledger` – credit allocations/deductions with reason and metadata.
- `question_set_shares` – optional share invitations for moderators/admins to distribute sets.

Indexes and RLS policies are included for efficient queries and privacy controls.

## Cloudflare Functions Catalogue

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth/login` | POST | Validates bearer token, returns session profile |
| `/api/auth/roleCheck` | POST | Fetches profile/role for current session |
| `/api/auth/listUsers` | POST | Admin-only listing of workspace users |
| `/api/auth/updateRole` | POST | Admin-only role mutation |
| `/api/credits/getCredits` | POST | Returns current credit balance |
| `/api/credits/deductCredits` | POST | Manual deduction helper (used for moderation tasks) |
| `/api/credits/allocate` | POST | Admin credit allocation |
| `/api/credits/ledger` | POST | Admin ledger view |
| `/api/questions/create` | POST | Create single question |
| `/api/questions/read` | POST | `mode=list|stats|sets` multi-purpose fetch |
| `/api/questions/update` | POST | Update question metadata/content |
| `/api/questions/delete` | POST | Delete question respecting role permissions |
| `/api/questions/batchUpload` | POST | Persist AI-extracted batch to Supabase |
| `/api/questions/createSet` | POST | Create question set |
| `/api/questions/mergeSets` | POST | Moderator/Admin merge |
| `/api/questions/duplicateSet` | POST | Duplicate set with cloned questions |
| `/api/questions/export` | POST | Return set and questions for frontend export (CSV/PDF/DOCX) |
| `/api/questions/share` | POST | Moderator/Admin share invite |
| `/api/ai/extractQuestions` | POST | Fetch signed storage object, invoke Gemini, deduct credits |
| `/api/ai/status` | GET | Poll AI job status |
| `/api/storage/uploadFile` | POST | Generates signed upload URL |
| `/api/storage/downloadFile` | POST | Generates signed download URL |

All routes require a Supabase session token via `Authorization: Bearer <access_token>`.

## Coding Guidelines

- **Type Safety:** Use Zod schemas in `src/utils/validators.js` before sending payloads to APIs.
- **Async UX:** Wrap network-heavy UI states with skeletons, toasts (`sonner`), and progress bars.
- **Theming:** Prefer utility classes with `glass-panel`/`glass-surface` helpers for consistent styling.
- **Hooks:** Place shared logic in context providers (`UserContext`, `CreditContext`) and React Query queries/mutations in pages/components.
- **Backend:** Always pass through `requireUser` for auth; enforce role checks via `assertRole` before privileged actions; log AI activity in `ai_logs`.

## Deployment Checklist

1. Configure Supabase (OAuth redirect, storage bucket, schema).
2. Set Cloudflare Pages env variables for production.
3. Run `npm run build` locally to verify the Vite build.
4. Deploy via git push or manual upload in Cloudflare Pages.
5. Verify walking skeleton: login, dashboard stats, credit deduction when uploading, export flows.

## Troubleshooting

- **401 errors:** Ensure client includes the Supabase session access token in `Authorization` headers (handled automatically after login).
- **402 errors:** Credit balance is insufficient—top up via Settings → Credit management or adjust `AI_EXTRACTION_CREDIT_COST`.
- **Gemini failures:** Inspect `ai_logs` table or Cloudflare logs; fallback questions still persist, so manual review is recommended.
- **CORS issues:** Cloudflare Pages Functions automatically co-locate with the SPA; ensure requests use relative `/api/*` URLs.

---

For further architectural decisions or API extensions, update this document and raise corresponding tickets.
