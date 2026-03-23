import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Landmark,
  HeartPulse,
  Palette,
  Users,
  Lock,
} from 'lucide-react';

const problems = [
  'Financial Exclusion',
  'Mental Health Gap',
  'Data Sovereignty Issues',
  'Infrastructure Limits',
  'SDG Financing Gap',
];

const solutions = [
  'DeFi Inclusion',
  'AI Mental Wellness',
  'Data Monetization',
  'Offline-First Solutions',
  'SDG Tokenization',
];

const pillars = [
  {
    icon: Landmark,
    title: 'Environment (JANI)',
    description: 'Earn tokens for impactful actions like tree planting & recycling.',
  },
  {
    icon: TrendingUp,
    title: 'Economy (UMOJA)',
    description: 'Access tokenized assets and securities for economic growth.',
  },
  {
    icon: HeartPulse,
    title: 'Health (HISA Telemedicine)',
    description: 'Receive rewards for wellness reporting and health-conscious actions.',
  },
  {
    icon: Palette,
    title: 'Culture (CHAT)',
    description: 'Preserve and trade cultural heritage through NFTs.',
  },
];

const howItWorks = [
    { title: "Join", description: "Connect via mobile/USSD or a Web3 wallet." },
    { title: "Contribute", description: "Add to liquidity, impact, staking, or telecare pools." },
    { title: "Orchestrate", description: "Agentic AI verifies, optimizes, and distributes rewards fairly." },
    { title: "Earn", description: "Receive tokens while directly supporting Sustainable Development Goals." },
]

export default function TokenomicsPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-foreground">
          Africa’s Resilient, Democratised, Decentralised Digital Economy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          HISA bridges Web2 to Web3, unlocking prosperity through finance,
          wellness, and sustainability.
        </p>
        <div className="mt-8">
          <Button size="lg">Join the Movement</Button>
        </div>
      </section>

      {/* Problem & Solution */}
      <section>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Africa's Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {problems.map((problem, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold text-sm">
                    !
                  </div>
                  <span>{problem}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline text-primary">
                HISA's Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {solutions.map((solution, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <span className="font-medium">{solution}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Mission */}
      <section className="text-center">
        <p className="text-2xl font-semibold font-headline text-foreground italic">
          “If you can verify it, you can value it. If you can value it, you can
          tokenize it.”
        </p>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            HISA transforms real-world contributions into digital value via Hedera's trusted network and agentic AI orchestration, ensuring every verified action generates tangible rewards.
        </p>
      </section>

      {/* Tokenomics Section */}
      <section>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">
          Tokenomics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>$HISA Token</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <p><strong>Supply:</strong> 3,000,000,000 (Fixed)</p>
                    <p><strong>Utility:</strong> Staking, Pool Access, Payments, Governance, Reputation.</p>
                    <p><strong>Deflationary:</strong> Transaction Burns, Pool Fees, Penalty Burns.</p>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>JANI & JANI STABLE</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <p><strong>Supply:</strong> 50 million initial supply</p>
                    <p><strong>Focus:</strong> Powering environmental and conservation initiatives.</p>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>UMOJA TOKEN, STABLE & OPTION</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <p><strong>Supply:</strong> 50 million initial supply</p>
                    <p><strong>Focus:</strong> Tokenized securities and economic development.</p>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>HISA Telemedicine Token</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <p><strong>Supply:</strong> Uses $HISA (3B fixed)</p>
                    <p><strong>Focus:</strong> Incentivizing health and wellness activities.</p>
                </CardContent>
            </Card>
             <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>CHAT Token</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <p><strong>Supply:</strong> 50 million initial supply</p>
                    <p><strong>Focus:</strong> Preserving culture and heritage through NFTs.</p>
                </CardContent>
            </Card>
             <Card className="flex flex-col justify-center bg-muted">
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground italic">
                     <span className='font-bold'>Note:</span> Only $HISA has a clearly defined supply (3B fixed). Other tokens operate with flexible or yet-to-be-published supply models.
                    </p>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* Four Pillars */}
      <section>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">
          Four Pillars Ecosystem
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="text-center p-6 flex flex-col items-center">
                <pillar.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="font-headline text-lg">{pillar.title}</CardTitle>
                <CardDescription className="mt-2 flex-grow">{pillar.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>
      
        {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
                 <div key={step.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg font-headline">
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6 italic">
            Powered by agentic AI for trust-minimized orchestration.
        </p>
      </section>

      {/* Governance & Security */}
      <section>
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Users /> Governance & Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Our DAO model ensures community-led governance. Token holders vote on proposals, elders’ councils provide guidance, and AI assists in execution.</p>
                    <p className='font-semibold'>Sub-DAOs include: Health, Conservation, Tech, and Finance.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Lock /> Compliance & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p>Built on Hedera Hashgraph for unparalleled speed, security, and a carbon-negative footprint.</p>
                    <p className='font-semibold'>KYC/AML aligned with Kenya’s 2025 Finance Act, featuring privacy-preserving ZK-proofs.</p>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 bg-muted rounded-lg">
         <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-foreground">
           Be part of Africa’s digital leap.
        </h2>
        <p className="mt-2 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Build wealth. Protect wellness. Preserve culture.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Read Whitepaper</Button>
        </div>
      </section>
    </div>
  );
}
