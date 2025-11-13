import { Tabs } from '../components/ui/Tabs.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useState } from 'react';

const guides = {
  overview: {
    title: 'Getting started with Gemini Question Bank',
    sections: [
      {
        heading: 'Connect with Google',
        items: [
          'Authenticate with Google OAuth via Supabase when you first access the dashboard.',
          'Your workspace role is assigned automatically; administrators can promote users in Settings.'
        ]
      },
      {
        heading: 'Upload and extract',
        items: [
          'Drag and drop PDF, DOCX, TXT, or XLSX files into the uploader on the Questions page.',
          'The AI extractor analyses each upload, suggests question metadata, and drafts multiple-choice options.'
        ]
      }
    ]
  },
  dashboard: {
    title: 'Dashboard tour',
    sections: [
      {
        heading: 'Mission control',
        items: [
          'Track cumulative questions, AI throughput, and moderation velocity in real time.',
          'Monitor credit usage trends to anticipate upcoming top-ups or unlocks.'
        ]
      },
      {
        heading: 'Activity stream',
        items: [
          'Keep tabs on private and open question changes as moderators publish updates.',
          'Audit AI usage with linked credit deductions for compliance reviews.'
        ]
      }
    ]
  },
  roles: {
    title: 'Role-based flows',
    sections: [
      {
        heading: 'Level 1 · Author',
        items: [
          'Create private question sets and release open content on approval.',
          'Consume credits per AI extraction with clear balance indicators.'
        ]
      },
      {
        heading: 'Level 2 · Moderator',
        items: [
          'Review, approve, and edit all questions, regardless of privacy setting.',
          'AI usage is credit-limited; request top-ups from administrators when needed.'
        ]
      },
      {
        heading: 'Level 3 · Admin',
        items: [
          'Manage roles, allocate credits, and configure AI rate limits and storage buckets.',
          'Admins enjoy unlimited credits but retain visibility into ledger events.'
        ]
      }
    ]
  }
};

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'roles', label: 'Roles' }
];

export default function IntroductionPage() {
  const [active, setActive] = useState('overview');
  const guide = guides[active];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3 text-center">
        <Badge className="mx-auto w-fit">Onboarding</Badge>
        <h1 className="text-4xl font-semibold text-gradient">{guide.title}</h1>
        <p className="text-sm text-slate-300">
          Understand the workspace before diving in. Each tab provides a guided walkthrough tailored to your role.
        </p>
      </div>
      <Tabs tabs={tabs} active={active} onChange={setActive} />
      <div className="grid gap-6 md:grid-cols-2">
        {guide.sections.map((section) => (
          <Card key={section.heading}>
            <CardHeader>
              <CardTitle>{section.heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-200">
                {section.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
