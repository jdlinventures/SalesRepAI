/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import config from "@/config";

// Premium black button for sign in
const ButtonSignin = ({ text = "Get Started", extraStyle }) => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <Link
        href={config.auth.callbackUrl}
        className={`btn ${extraStyle ? extraStyle : "btn-primary"}`}
      >
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || "Account"}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-[#F4F4F5] flex justify-center items-center rounded-full shrink-0 text-[#52525B] text-sm font-medium">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        {session.user?.name || session.user?.email || "Account"}
      </Link>
    );
  }

  return (
    <Link
      href={`/signin?callbackUrl=${encodeURIComponent(config.auth.callbackUrl)}`}
      className={`btn ${extraStyle ? extraStyle : "btn-primary"}`}
    >
      {text}
    </Link>
  );
};

export default ButtonSignin;
