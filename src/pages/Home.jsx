import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { AuthModal } from '../components/ui/AuthModal.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useState } from 'react';
import heroImage from '../assets/hero-grid.svg';

const featureHighlights = [
  {
    title: 'AI-Powered Extraction',
    description: 'Leverage Gemini to turn documents into polished question banks with explanations and options.'
  },
  {
    title: 'Role-Based Workflows',
    description: 'Admins, moderators, and authors collaborate with fine-grained permissions and credit controls.'
  },
  {
    title: 'Cloud Native',
    description: 'Cloudflare Pages, Supabase, and Gemini deliver a fully serverless, globally distributed experience.'
  }
];

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:py-24">
        <div className="glass-surface relative overflow-hidden px-10 py-16">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-cover bg-center opacity-60 lg:block" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="relative max-w-xl space-y-6">
            <Badge className="w-fit">Cloudflare Pages · Supabase · Gemini</Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gradient sm:text-5xl">
              Build, curate, and scale intelligent assessment banks
            </h1>
            <p className="text-lg text-slate-200">
              Upload PDFs, Word documents, spreadsheets, or text files and watch Gemini AI craft structured question sets.
              Manage private and open collections, moderate collaboratively, and control usage with a transparent credit system.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={handleAuthClick}>
                {user ? 'Enter dashboard' : 'Get started'}
              </Button>
            </div>
          </div>
        </div>
        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="glass-panel h-full space-y-3 p-6">
              <h3 className="text-xl font-semibold text-gradient">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>
      
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
