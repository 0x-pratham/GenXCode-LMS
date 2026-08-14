import { Mail, MessageSquare, Terminal, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Support | GenXCode",
  description: "Get help from the GenXCode engineering team.",
};

export default function SupportPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto relative z-10">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[#E2D1FE]/70 hover:text-white transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full w-fit hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
            <span className="text-sm font-semibold tracking-widest text-[#E2D1FE] uppercase">Help Center</span>
            <span className="w-8 h-[2px] bg-brand-gradient rounded-full"></span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent pb-2 drop-shadow-md">
            How can we help?
          </h1>
          <p className="text-[#E2D1FE]/80 max-w-lg mx-auto text-base md:text-lg">
            Whether you're facing platform issues or need clarification on leaderboard mechanics, our engineering team is here to assist.
          </p>
        </div>

        {/* Contact Grids */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center hover:border-white/20 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">Direct Email</h3>
            <p className="text-[#E2D1FE]/70 mb-8 max-w-sm">
              For urgent account inquiries, invite status, or bug reports. We typically respond within 24 hours.
            </p>
            <a href="mailto:ofc.genxcode@gmail.com">
              <Button variant="outline" className="rounded-full px-8 hover:bg-white/5 border-white/10 h-12">
                ofc.genxcode@gmail.com
              </Button>
            </a>
          </div>

          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center hover:border-white/20 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">WhatsApp Community</h3>
            <p className="text-[#E2D1FE]/70 mb-8 max-w-sm">
              Connect with other elite developers, discuss hackathons, and get peer-to-peer support in real-time.
            </p>
            {/* Removed the extra glow shadow for consistency */}
            <Button variant="premium" className="rounded-full px-8 h-12 font-bold transition-transform hover:-translate-y-0.5">
              Join the Server
            </Button>
          </div>
        </div>

        {/* Quick FAQ Grid */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-bold text-foreground font-heading">Common Queries</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQCard 
              question="How do I get an invite?"
              answer="Platform access is strictly curated. You must submit your GitHub or Portfolio via the 'Request Invite' page. Our team reviews profiles weekly."
            />
            <FAQCard 
              question="How is Leaderboard XP calculated?"
              answer="XP is awarded based on project submissions, hackathon rankings, and algorithmic efficiency in coding challenges."
            />
            <FAQCard 
              question="Can I form a team with external developers?"
              answer="No. All hackathon participants must be verified GenXCode members with an active account on the platform."
            />
            <FAQCard 
              question="I found a bug. Where do I report it?"
              answer="Please email ofc.genxcode@gmail.com with the subject 'Bug Report' and include steps to reproduce the issue."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function FAQCard({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <Terminal className="w-5 h-5 text-accent shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-lg text-white mb-2">{question}</h4>
          <p className="text-sm text-[#E2D1FE]/60 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}