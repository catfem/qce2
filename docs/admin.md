# Admin Guide

Level 3 administrators have full control over roles, credits, and AI policies. This document outlines day-to-day responsibilities and troubleshooting steps.

## 1. Admin Responsibilities

- Maintain the workspace membership roster and assign appropriate roles.
- Configure credit allowances and monitor usage to prevent workflow interruptions.
- Oversee AI activity for compliance, speed, and error tracking.
- Adjust platform configuration (bucket names, rate limits, credit costs) via environment variables when deploying updates.

## 2. Managing Credits

Navigate to **Settings → Credit Management** to:

1. Select a user from the dropdown (email + current role are displayed).
2. Enter the number of credits to allocate (positive or negative integers).
3. Click **Allocate credits**.

The ledger below shows the latest 50 credit events (allocations and deductions). Positive values mean credits were added; negative values indicate consumption. Use this view during audits or when disputes arise.

### Automatic Deductions

- AI extractions deduct the amount defined by `AI_EXTRACTION_CREDIT_COST` unless the requester is an admin (admins are unlimited).
- Manual deductions can also be triggered by calling `/api/credits/deductCredits`, which the frontend uses for moderation scenarios.

## 3. Role Management

In **Settings → Role Management**:

1. Select a member.
2. Choose a new role (Level 1 User, Level 2 Moderator, Level 3 Admin).
3. Click **Update role**.

Role impacts:

- **User** – limited to their own private content, credit-gated AI usage.
- **Moderator** – can review/edit/delete all questions, but remains credit-limited for AI extraction.
- **Admin** – unlimited credits, can top up others, merge/duplicate/share sets, and access all settings.

## 4. Monitoring AI Usage

- Review AI utilisation stats on the **Dashboard** (extractions, reviews, difficulty breakdown).
- Inspect `ai_logs` in Supabase or through the Recent Activity list for latency, failure reasons, and metadata.
- Adjust `AI_RATE_LIMIT_PER_MINUTE` to throttle excessive activity if needed.

## 5. Storage & Data Hygiene

- Ensure the `SUPABASE_STORAGE_BUCKET` exists and has proper RLS/storage policies in Supabase.
- Periodically prune unused files or use Supabase lifecycle policies if storage quotas are a concern.
- Encourage moderators to archive or delete stale questions to keep analytics relevant.

## 6. Environment & Deployment Settings

| Variable | Purpose |
| --- | --- |
| `DEFAULT_STARTING_CREDITS` | Credits granted to new users the first time they log in |
| `AI_EXTRACTION_CREDIT_COST` | Cost per Gemini extraction (applies to users & moderators) |
| `AI_RATE_LIMIT_PER_MINUTE` | Hard limit on extraction calls per minute per user |
| `SUPABASE_STORAGE_BUCKET` | Bucket storing staged uploads |
| `GEMINI_MODEL` | Pick a Gemini variant (e.g. `models/gemini-1.5-pro`) if your quota allows |

When updating values, redeploy via Cloudflare Pages to ensure bindings refresh.

## 7. Troubleshooting

- **Users cannot log in:** verify Supabase OAuth settings and that `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are correct in Cloudflare bindings.
- **Credits not updating:** check `credits_ledger` for conflicting entries; ensure Admins use the Settings panel, not direct database edits.
- **AI extraction fails immediately:** confirm Gemini API key validity and quota; inspect Cloudflare logs for detailed errors.
- **Export payloads empty:** ensure the question set contains questions; moderators may have set everything to private while you are viewing as a different user.

## 8. Security Best Practices

- Rotate the Supabase service-role key regularly and update Cloudflare bindings.
- Enable Supabase Row Level Security (RLS) policies if you expose the database outside this application.
- Maintain minimal admin accounts and enforce MFA via Google Workspace if available.

---

Keep this guide updated as workflows evolve. Administrators are the guardians of data quality, credit fairness, and platform uptime.
