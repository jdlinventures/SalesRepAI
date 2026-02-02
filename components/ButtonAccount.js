/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";
import apiClient from "@/libs/api";

const ButtonAccount = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleBilling = async () => {
    setIsLoading(true);
    try {
      const { url } = await apiClient.post("/stripe/create-portal", {
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  if (status === "unauthenticated") return null;

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-[#F4F4F5] transition-colors focus:outline-none">
            {session?.user?.image ? (
              <img
                src={session?.user?.image}
                alt={session?.user?.name || "Account"}
                className="w-8 h-8 rounded-full flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#F4F4F5] flex items-center justify-center flex-shrink-0 text-[13px] font-medium text-[#52525B]">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
              </div>
            )}

            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-medium text-[#18181B] truncate">
                {session?.user?.name || "Account"}
              </p>
              <p className="text-[12px] text-[#A1A1AA] truncate">
                {session?.user?.email}
              </p>
            </div>

            {isLoading ? (
              <div className="loading-spinner !w-4 !h-4" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 text-[#A1A1AA] transition-transform duration-150 flex-shrink-0 ${
                  open ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Popover.Button>

          <Transition
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute bottom-full left-0 right-0 mb-2">
              <div className="dropdown-menu">
                <button
                  className="dropdown-item w-full"
                  onClick={handleBilling}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
                  </svg>
                  Billing
                </button>
                <button
                  className="dropdown-item dropdown-item-danger w-full"
                  onClick={handleSignOut}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
                  </svg>
                  Log out
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ButtonAccount;
