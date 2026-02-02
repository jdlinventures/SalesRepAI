"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
];

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-[#E4E4E7]">
      <nav className="container-lg flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          title={`${config.appName} homepage`}
        >
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="w-8 h-8"
            placeholder="blur"
            priority={true}
            width={32}
            height={32}
          />
          <span className="text-[15px] font-semibold text-[#18181B] tracking-[-0.01em]">
            {config.appName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#52525B] hover:text-[#18181B] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ButtonSignin text="Get Started" extraStyle="btn-primary" />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2 rounded-lg hover:bg-[#F4F4F5] transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-[#18181B]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-[320px] bg-white shadow-xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-[#E4E4E7]">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src={logo}
                  alt={`${config.appName} logo`}
                  className="w-8 h-8"
                  placeholder="blur"
                  priority={true}
                  width={32}
                  height={32}
                />
                <span className="text-[15px] font-semibold text-[#18181B] tracking-[-0.01em]">
                  {config.appName}
                </span>
              </Link>
              <button
                type="button"
                className="p-2 -mr-2 rounded-lg hover:bg-[#F4F4F5] transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#18181B]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Links */}
            <div className="px-4 py-6">
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2.5 text-[15px] font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-[1px] bg-[#E4E4E7] my-6" />

              <ButtonSignin
                text="Get Started"
                extraStyle="btn-primary w-full"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
