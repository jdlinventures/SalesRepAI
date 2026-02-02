import Link from "next/link";
import config from "@/config";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#18181B] p-12 flex-col justify-between">
        <Link href="/" className="text-white text-[20px] font-semibold tracking-tight">
          {config.appName}
        </Link>

        <div>
          <blockquote className="text-white/90 text-[24px] leading-[1.4] font-medium mb-6">
            "SalesRepAI transformed our outbound calls. We're reaching 10x more prospects with personalized conversations."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div>
              <p className="text-white font-medium">John Davis</p>
              <p className="text-white/60 text-[14px]">VP of Sales, TechCorp</p>
            </div>
          </div>
        </div>

        <p className="text-white/40 text-[13px]">
          &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-[#18181B] text-[20px] font-semibold tracking-tight">
              {config.appName}
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
