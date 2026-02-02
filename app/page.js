import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonSignin from "@/components/ButtonSignin";

// Feature card with precise spacing and alignment
const FeatureCard = ({ icon, title, description }) => (
  <div className="group">
    <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center mb-5 group-hover:bg-[#E4E4E7] transition-colors duration-200">
      {icon}
    </div>
    <h3 className="text-[17px] font-semibold text-[#18181B] tracking-[-0.01em] mb-2">
      {title}
    </h3>
    <p className="text-[15px] leading-[1.6] text-[#71717A]">
      {description}
    </p>
  </div>
);

// Step card with number indicator
const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-11 h-11 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[15px] font-semibold mx-auto mb-5">
      {number}
    </div>
    <h3 className="text-[17px] font-semibold text-[#18181B] tracking-[-0.01em] mb-2">
      {title}
    </h3>
    <p className="text-[15px] leading-[1.6] text-[#71717A] max-w-[280px] mx-auto">
      {description}
    </p>
  </div>
);

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section - Generous whitespace, centered content */}
        <section className="section-hero">
          <div className="container-md text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F4F5] text-[13px] font-medium text-[#52525B] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              Now available for early access
            </div>

            {/* Headline */}
            <h1 className="text-display mb-6">
              Voice AI Agents
              <br />
              That Close Deals
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg max-w-[520px] mx-auto mb-10">
              Build intelligent voice agents that handle sales calls, qualify leads,
              and book meetings—24/7. No coding required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <ButtonSignin
                text="Get Started Free"
                extraStyle="btn-primary btn-lg !px-6"
              />
              <Link
                href="#how-it-works"
                className="btn btn-ghost btn-lg !px-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Social proof */}
            <p className="text-[13px] text-[#A1A1AA] mt-8">
              Trusted by 500+ sales teams worldwide
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section-default bg-[#FAFAFA]">
          <div className="container-lg">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-h1 mb-4">Everything you need</h2>
              <p className="text-body-lg max-w-[480px] mx-auto">
                Powerful features to create, deploy, and manage your voice AI agents.
              </p>
            </div>

            {/* Feature grid - 3 columns with consistent spacing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 max-w-[960px] mx-auto">
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#18181B]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                }
                title="Natural Conversations"
                description="AI-powered voice agents that sound human and understand context, making every interaction feel natural."
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#18181B]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                }
                title="Instant Setup"
                description="Connect with your existing tools in minutes. Works with popular CRMs, calendars, and platforms."
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#18181B]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                }
                title="Real-time Analytics"
                description="Track performance, analyze conversations, and optimize your agents with detailed insights."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-default bg-white">
          <div className="container-lg">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-h1 mb-4">How it works</h2>
              <p className="text-body-lg max-w-[440px] mx-auto">
                Get your AI voice agent up and running in three simple steps.
              </p>
            </div>

            {/* Steps - horizontal line connecting them on desktop */}
            <div className="relative max-w-[840px] mx-auto">
              {/* Connecting line - hidden on mobile */}
              <div className="hidden md:block absolute top-[22px] left-[16.67%] right-[16.67%] h-[1px] bg-[#E4E4E7]"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
                <StepCard
                  number="1"
                  title="Create Your Agent"
                  description="Define your agent's personality, knowledge base, and goals through our intuitive interface."
                />
                <StepCard
                  number="2"
                  title="Configure Voice"
                  description="Choose from premium AI voices or clone your own. Customize tone and speaking style."
                />
                <StepCard
                  number="3"
                  title="Deploy & Scale"
                  description="Launch your agent and let it handle calls 24/7. Scale effortlessly as you grow."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Dark background */}
        <section className="section-default bg-[#18181B]">
          <div className="container-sm text-center">
            <h2 className="text-[32px] md:text-[40px] font-semibold text-white tracking-[-0.025em] leading-[1.15] mb-4">
              Ready to transform your sales?
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#A1A1AA] mb-10 max-w-[420px] mx-auto">
              Join thousands of businesses using AI voice agents to close more deals.
            </p>
            <ButtonSignin
              text="Get Started Free"
              extraStyle="!bg-white !text-[#18181B] !border-white hover:!bg-[#F4F4F5] btn-lg !px-6"
            />
            <p className="text-[13px] text-[#71717A] mt-6">
              No credit card required
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
