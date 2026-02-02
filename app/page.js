import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonSignin from "@/components/ButtonSignin";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-[720px] mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F4F5] text-[13px] font-medium text-[#52525B] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                AI-powered sales training
              </div>

              {/* Headline */}
              <h1 className="text-[40px] md:text-[56px] font-semibold text-[#18181B] tracking-[-0.025em] leading-[1.15] mb-6">
                Run more mocks.
                <br />
                <span className="text-[#71717A]">Close more deals.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-[17px] md:text-[19px] leading-[1.6] text-[#52525B] mb-10 max-w-[540px] mx-auto">
                Run mock calls with AI prospects anytime. Practice discovery,
                master objections, and stack more commissions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <ButtonSignin
                  text="Start Practicing Free"
                  extraStyle="btn-primary h-12 !px-6 text-[15px]"
                />
                <Link
                  href="#how-it-works"
                  className="btn btn-ghost h-12 !px-6 text-[15px]"
                >
                  See How It Works
                </Link>
              </div>

              {/* Social proof */}
              <p className="text-[13px] text-[#A1A1AA] mt-10">
                Trusted by 2,000+ sales reps at high-growth companies
              </p>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 md:py-24 bg-[#FAFAFA] border-t border-b border-[#E4E4E7]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-[800px] mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <h2 className="text-[28px] md:text-[36px] font-semibold text-[#18181B] tracking-[-0.02em] leading-[1.2] mb-4">
                  Stop losing deals you should be winning
                </h2>
                <p className="text-[17px] leading-[1.6] text-[#71717A] max-w-[520px] mx-auto">
                  Most sales reps only practice on real prospects—and pay the price
                  with lost commissions. SalesRepAI changes that.
                </p>
              </div>

              {/* Problem cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-[#E4E4E7] p-6">
                  <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#DC2626]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#18181B] mb-2">
                    Fumbling objections
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#71717A]">
                    Getting caught off guard by "I need to think about it" or "send me an email" kills deals.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E4E4E7] p-6">
                  <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#DC2626]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#18181B] mb-2">
                    Weak discovery calls
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#71717A]">
                    Missing pain points and failing to build urgency means prospects ghost you.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E4E4E7] p-6">
                  <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#DC2626]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#18181B] mb-2">
                    No safe place to fail
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#71717A]">
                    Every real call is high stakes. One bad pitch and that lead is gone forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-[800px] mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <h2 className="text-[28px] md:text-[36px] font-semibold text-[#18181B] tracking-[-0.02em] leading-[1.2] mb-4">
                  Your personal AI sales coach
                </h2>
                <p className="text-[17px] leading-[1.6] text-[#71717A] max-w-[480px] mx-auto">
                  Practice anytime, get instant feedback, and level up your skills
                  without risking real deals.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#18181B] mb-2">
                      Realistic AI roleplay
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[#71717A]">
                      Practice with AI prospects that respond like real buyers—skeptical,
                      busy, and full of objections. Configure different personas, industries,
                      and difficulty levels.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#18181B] mb-2">
                      Instant performance feedback
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[#71717A]">
                      Get detailed analysis after every call. See exactly where you lost
                      control, missed buying signals, or could have pushed harder.
                      Track improvement over time.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#18181B] mb-2">
                      Drill your weak spots
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[#71717A]">
                      Struggling with price objections? Nervous about closing?
                      Create custom scenarios to practice specific situations until
                      you handle them effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-24 bg-[#FAFAFA] border-t border-b border-[#E4E4E7]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-[800px] mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <h2 className="text-[28px] md:text-[36px] font-semibold text-[#18181B] tracking-[-0.02em] leading-[1.2] mb-4">
                  Start improving in minutes
                </h2>
                <p className="text-[17px] leading-[1.6] text-[#71717A] max-w-[440px] mx-auto">
                  No complex setup. No lengthy onboarding. Just start practicing.
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                <div className="text-center">
                  <div className="w-11 h-11 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[15px] font-semibold mx-auto mb-5">
                    1
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#18181B] mb-2">
                    Create your agent
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#71717A]">
                    Set up an AI prospect with the persona, objections, and
                    difficulty level you want to practice.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-11 h-11 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[15px] font-semibold mx-auto mb-5">
                    2
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#18181B] mb-2">
                    Run practice calls
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#71717A]">
                    Jump into live voice conversations. The AI responds in
                    real-time just like a real prospect would.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-11 h-11 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[15px] font-semibold mx-auto mb-5">
                    3
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#18181B] mb-2">
                    Review & improve
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-[#71717A]">
                    Get feedback on your performance, identify patterns,
                    and track your progress over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial/Results Section */}
        <section className="py-20 md:py-24">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-[640px] mx-auto text-center">
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FACC15]">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-[20px] md:text-[24px] font-medium text-[#18181B] leading-[1.5] mb-6">
                "I was averaging 2 closes per week. After practicing with SalesRepAI
                for a month, I'm now at 5-6. The objection handling practice alone
                was worth it."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[14px] font-medium text-[#52525B]">
                  MR
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-medium text-[#18181B]">Marcus Rodriguez</p>
                  <p className="text-[13px] text-[#71717A]">SDR at CloudScale</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-[#18181B]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-[560px] mx-auto text-center">
              <h2 className="text-[28px] md:text-[36px] font-semibold text-white tracking-[-0.02em] leading-[1.2] mb-4">
                Ready to close more deals?
              </h2>
              <p className="text-[17px] leading-[1.6] text-[#A1A1AA] mb-8">
                Stop losing deals to preventable mistakes. Start practicing today
                and watch your numbers climb.
              </p>
              <ButtonSignin
                text="Start Practicing Free"
                extraStyle="!bg-white !text-[#18181B] !border-white hover:!bg-[#F4F4F5] h-12 !px-6 text-[15px]"
              />
              <p className="text-[13px] text-[#71717A] mt-6">
                Free to start. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
