# User Guide

Welcome to the Gemini AI Question Bank. This guide walks through onboarding, dashboard insights, file uploads, and managing questions.

## 1. Getting Started

1. Open the application (Cloudflare Pages URL or `http://localhost:5173` in development).
2. Click **Continue with Google** on the home page. You will be redirected to Supabase’s Google OAuth flow.
3. After login, you land on the **Dashboard**.

> Your workspace role determines what you can see and do. Level 1 (User) accounts manage their own content; Level 2 (Moderator) accounts can review every question; Level 3 (Admin) accounts control settings and credits.

## 2. Dashboard Overview

The dashboard highlights:

- **Mission Control cards** – total questions, private vs. open counts, and trends over the last 30 days.
- **AI Utilisation** – how many extractions/reviews occurred, and the difficulty breakdown across the bank.
- **Credit Overview** – remaining credits (∞ for admins) and a rolling ledger of allocations/deductions.
- **Recent Activity** – latest AI jobs and moderation events with relative timestamps.

Use this page to monitor personal progress and plan credit usage before initiating large uploads.

## 3. Onboarding & Introduction Pages

Navigate to **Introduction** for a guided tour:

- **Overview tab** – how Google login, uploads, and AI review loops work.
- **Dashboard tab** – tips for interpreting analytics and activity feeds.
- **Roles tab** – responsibilities and allowances for each role tier.

## 4. Uploading Files & AI Extraction

1. Open the **Questions** page.
2. Drag-and-drop PDF, DOCX, TXT, or XLSX files into the dropzone (or click to browse).
3. The UI displays upload progress while Supabase Storage stages the documents.
4. Gemini AI processes each file and produces a batch of questions. You’ll see a review modal when ready.
5. Review the generated question set:
   - Edit titles, prompts, explanations, difficulty, categories, and options.
   - Toggle **Private** to keep the set visible only to you (plus moderators/admins) or publish as **Open**.
6. Click **Save X questions** to persist them. Your credit balance refreshes automatically.

If credits are insufficient, you’ll receive an alert and the extraction will not run. Contact an admin for a top-up.

## 5. Managing Questions

Within the **Questions** page:

- **Filters** – search by title/tag, difficulty, category, and visibility.
- **Table actions** – edit question content, delete (if you are the creator or have moderator rights), toggle private/open status.
- **Question Sets** panel – create new sets, merge two sets, duplicate a set, export (CSV/PDF/DOCX), or share sets (moderator/admin only).
- **Exports** – downloaded files include your questions, options, and explanations for offline review.

## 6. Settings & Account

The **Settings** page summarises:

- Account email, current role, and available credits.
- AI configuration hints (rate limits, storage bucket, credit costs).
- Admin-only panels for credit management and role assignments.

As a non-admin user you can still reference the information tiles to understand how the workspace is configured.

## 7. Tips & Best Practices

- Maintain meaningful tags and references so team members can filter quickly.
- Use private sets while refining questions; publish to open once they are ready.
- Re-run AI extraction on improved source files to enrich the bank, but keep an eye on credit consumption.
- Moderators should record notable edits in set descriptions or share notes via external collaboration tools.

## 8. Need Help?

- Insufficient credits? Contact an admin (Settings → Credit Management) to request a top-up.
- Question set missing? Ensure you toggled “View all questions” instead of “Private only.”
- Technical issues? Capture console/network details and share with the engineering team; refer them to `docs/developer.md`.

Enjoy building rich assessment content with Gemini assistance!
