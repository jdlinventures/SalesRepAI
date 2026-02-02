"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyRequestPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-[#18181B]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>

      <h1 className="text-[24px] font-semibold text-[#18181B] tracking-tight mb-2">
        Check your email
      </h1>

      <p className="text-[15px] text-[#71717A] leading-relaxed mb-8">
        {email ? (
          <>
            A sign-in link has been sent to{" "}
            <span className="font-medium text-[#18181B]">{email}</span>.
          </>
        ) : (
          "A sign-in link has been sent to your email address."
        )}
        <br />
        Click the link to sign in to your account.
      </p>

      <div className="space-y-4">
        <Link href="/signin" className="btn btn-primary w-full h-12">
          Back to Sign In
        </Link>

        <p className="text-[13px] text-[#A1A1AA]">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <Link href="/signin" className="text-[#18181B] hover:underline">
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
