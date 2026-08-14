import { Scale, FileText, AlertTriangle, UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | GenXCode",
  description: "Rules and regulations for using the GenXCode platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[#E2D1FE]/70 hover:text-white transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full w-fit hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
            <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase">Legal</span>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-2 drop-shadow-md">
            Terms of Service
          </h1>
          <p className="text-[#E2D1FE]/60 uppercase tracking-widest text-xs font-mono">
            Last Updated: August 2026
          </p>
        </div>

        <div className="space-y-6">
          <SectionCard 
            icon={<FileText className="w-6 h-6 text-accent" />}
            title="1. Acceptance of Terms"
            content="By accessing or using the GenXCode platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the service. Access is currently invite-only and subject to strict verification."
          />
          <SectionCard 
            icon={<UserCheck className="w-6 h-6 text-accent" />}
            title="2. User Conduct & Elite Standards"
            content="GenXCode is an elite environment. You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Plagiarism, cheating in hackathons, or manipulating leaderboard XP will result in an immediate, permanent ban."
          />
          <SectionCard 
            icon={<Scale className="w-6 h-6 text-accent" />}
            title="3. Intellectual Property"
            content="The platform and its original content, features, and functionality are owned by GenXCode and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws."
          />
          <SectionCard 
            icon={<AlertTriangle className="w-6 h-6 text-accent" />}
            title="4. Termination"
            content="We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the platform will immediately cease."
          />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground font-heading">{title}</h2>
      </div>
      <p className="text-base text-[#E2D1FE]/70 leading-relaxed pl-16">
        {content}
      </p>
    </div>
  );
}