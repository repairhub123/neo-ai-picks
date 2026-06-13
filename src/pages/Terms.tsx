import React from 'react';
import { ShieldCheck, Calendar, Scale } from 'lucide-react';
import SEO from '../components/SEO';

interface TermsProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const Terms: React.FC<TermsProps> = () => {
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Neo AI Picks",
    "description": "Read the Terms of Service governing the use of the Neo AI Picks directory and submissions."
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-12 px-6">
      <SEO
        title="Terms of Service | Neo AI Picks"
        description="Read the Terms of Service for Neo AI Picks. Understand directory usage regulations, tool submission policies, and liability terms."
        path="/terms"
        jsonLd={termsSchema}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="space-y-4 border-b border-white/5 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            Terms & Conditions
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              Effective Date: June 14, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Vetted Directory Standards
            </span>
          </div>
        </div>

        {/* TERMS CONTENT */}
        <div className="prose prose-invert prose-indigo max-w-none text-slate-300 space-y-6 leading-relaxed text-sm md:text-base font-medium">
          <p>
            Welcome to **Neo AI Picks**. These terms and conditions outline the rules and regulations for the use of Neo AI Picks' Website, located at [neoaipicks.com](https://neoaipicks.com).
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Neo AI Picks if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <hr className="border-white/5 my-8" />

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            1. Intellectual Property
          </h3>
          <p>
            Other than the content you own, under these Terms, Neo AI Picks and/or its licensors own all the intellectual property rights and materials contained in this Website. All rights are reserved. You are granted a limited license only for purposes of viewing the material contained on this Website.
          </p>
          <p>
            The listed AI tool logos, names, and websites are the intellectual property of their respective owners. We display them for discovery and indexing purposes only.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            2. Directory Usage Restrictions
          </h3>
          <p>
            You are specifically restricted from all of the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-350 ml-4">
            <li>Publishing any Website material in any other media without credit.</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website content.</li>
            <li>Using web scrapers, bots, or script automations to copy tools directory profiles.</li>
            <li>Using this Website in any way that is or may be damaging to this Website.</li>
            <li>Simulating bookmarks or upvotes via script bots to manipulate tool ratings.</li>
            <li>Using this Website contrary to applicable laws and regulations.</li>
          </ul>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            3. Tool Submissions Policy
          </h3>
          <p>
            If you submit a tool using our Submit Tool form:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-350 ml-4">
            <li>You warrant that you are the owner or authorized representative of the tool being listed.</li>
            <li>You grant Neo AI Picks a non-exclusive, worldwide license to display your tool details, logo, description, and pricing models.</li>
            <li>We reserve the right to edit descriptions, select category alignments, write pros & cons, or reject any submissions to maintain our quality standards.</li>
            <li>Fake statistics, spam descriptions, or link-farming submissions will be deleted immediately.</li>
          </ul>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            4. No Warranties
          </h3>
          <p>
            This Website is provided "as is," with all faults, and Neo AI Picks expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. We do not guarantee the uptime, performance, or correctness of the tools profiled in our directory. Users choose to purchase third-party plans at their own discretion.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            5. Limitation of Liability
          </h3>
          <p>
            In no event shall Neo AI Picks, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website. Neo AI Picks, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website or the listed third-party AI tools.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            6. Governing Law & Jurisdiction
          </h3>
          <p>
            These Terms will be governed by and interpreted in accordance with the laws of the jurisdiction of our headquarters, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that region for the resolution of any disputes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
