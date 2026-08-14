import { Shield, Eye, Lock, Server, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | GenXCode",
  description: "How we handle and protect your data.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-[#E2D1FE]/60 uppercase tracking-widest text-xs font-mono">
            Last Updated: August 2026
          </p>
        </div>

        <div className="space-y-6">
          <SectionCard 
            icon={<Eye className="w-6 h-6 text-accent" />}
            title="1. Information We Collect"
            content="We collect information you provide directly to us when you create an account, update your profile, participate in hackathons, or communicate with us. This includes your name, email address, GitHub/Portfolio URLs, and any other data you choose to provide."
          />
          <SectionCard 
            icon={<Server className="w-6 h-6 text-accent" />}
            title="2. How We Use Your Data"
            content="Your data is used to provide, maintain, and improve our elite platform. We use it to verify your engineering credentials, manage your hackathon participations, calculate your global leaderboard rankings, and send you critical platform updates."
          />
          <SectionCard 
            icon={<Shield className="w-6 h-6 text-accent" />}
            title="3. Data Sharing & Security"
            content="We do not sell your personal data. We may share information with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential."
          />
          <SectionCard 
            icon={<Lock className="w-6 h-6 text-accent" />}
            title="4. Your Rights"
            content="As a verified member of GenXCode, you have the right to access, correct, or delete your personal data at any time. You can manage your information directly from your portal dashboard or by contacting our support team."
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