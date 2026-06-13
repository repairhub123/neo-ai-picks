import React from 'react';
import { ShieldCheck, Calendar, Lock } from 'lucide-react';
import SEO from '../components/SEO';

interface PrivacyProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const Privacy: React.FC<PrivacyProps> = () => {
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Neo AI Picks",
    "description": "Understand how Neo AI Picks collects, protects, and handles your user details and submitted data."
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-12 px-6">
      <SEO
        title="Privacy Policy | Neo AI Picks"
        description="Read the Privacy Policy for Neo AI Picks. Learn how we handle your personal data, listings data, cookie policies, and site security parameters."
        path="/privacy"
        jsonLd={privacySchema}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="space-y-4 border-b border-white/5 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            Compliance & Security
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              Effective Date: June 14, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              GDPR & CCPA Compliant
            </span>
          </div>
        </div>

        {/* POLICY CONTENT */}
        <div className="prose prose-invert prose-indigo max-w-none text-slate-300 space-y-6 leading-relaxed text-sm md:text-base font-medium">
          <p>
            At **Neo AI Picks**, accessible from [neoaipicks.com](https://neoaipicks.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Neo AI Picks and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at [contact@neoaipicks.com](mailto:contact@neoaipicks.com).
          </p>

          <hr className="border-white/5 my-8" />

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            1. Consent
          </h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            2. Information We Collect
          </h3>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-350 ml-4">
            <li><strong>Tool Submissions:</strong> When listing an AI tool, we collect the submitter's email, tool metadata, website links, pricing information, and features list for verification.</li>
            <li><strong>Newsletter Subscriptions:</strong> If you sign up for our weekly digest, we collect your email address to deliver updates.</li>
            <li><strong>Communications:</strong> If you contact us directly via our Contact form, we receive details such as your name, email address, subject line, and the content of the message.</li>
          </ul>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            3. How We Use Your Information
          </h3>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-350 ml-4">
            <li>Provide, operate, and maintain our AI directory.</li>
            <li>Improve, personalize, and expand our platform reviews.</li>
            <li>Understand and analyze how visitors browse our website (via Google Analytics).</li>
            <li>Develop new directory structures, comparison matrices, and filters.</li>
            <li>Communicate with you regarding listed tools or newsletter items.</li>
            <li>Detect and prevent spam, malicious upvotes, or fake submissions.</li>
          </ul>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            4. Log Files and Analytical Cookies
          </h3>
          <p>
            Neo AI Picks follows a standard procedure of using log files and cookies. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
          <p>
            Our analytics provider is Google Analytics. We use this to track anonymized user sessions to measure directory engagement. No personally identifiable search data is recorded.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            5. Third-Party Links & Partner Sites
          </h3>
          <p>
            Neo AI Picks contains links to external AI tool websites. Our privacy policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            6. GDPR Data Protection Rights
          </h3>
          <p>
            We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-350 ml-4">
            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data.</li>
            <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your data.</li>
          </ul>

          <h3 className="text-lg md:text-xl font-bold text-white pt-2 flex items-center gap-2">
            7. Contact Support
          </h3>
          <p>
            If you would like to exercise any of these compliance rights or request edits/removal of your listed AI tool from our directory, please write to: **contact@neoaipicks.com**.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
