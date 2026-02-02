import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E4E4E7]">
      <div className="container-lg py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                priority={true}
                className="w-7 h-7"
                width={28}
                height={28}
              />
              <span className="text-[15px] font-semibold text-[#18181B] tracking-[-0.01em]">
                {config.appName}
              </span>
            </Link>
            <p className="text-[14px] leading-[1.6] text-[#71717A] max-w-[240px]">
              {config.appDescription}
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-[13px] font-semibold text-[#18181B] uppercase tracking-[0.05em] mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[13px] font-semibold text-[#18181B] uppercase tracking-[0.05em] mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  Blog
                </Link>
              </li>
              {config.resend.supportEmail && (
                <li>
                  <a
                    href={`mailto:${config.resend.supportEmail}`}
                    className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                  >
                    Contact
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-[13px] font-semibold text-[#18181B] uppercase tracking-[0.05em] mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/tos"
                  className="text-[14px] text-[#71717A] hover:text-[#18181B] transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 mt-12 border-t border-[#E4E4E7]">
          <p className="text-[13px] text-[#A1A1AA]">
            &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A1A1AA] hover:text-[#18181B] transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A1A1AA] hover:text-[#18181B] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
