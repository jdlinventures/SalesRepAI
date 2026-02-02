"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const DeleteAgentModal = ({ isOpen, onClose, onConfirm, agent, isDeleting }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[400px] bg-white rounded-xl shadow-xl p-6">
                {/* Icon and title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-[#DC2626]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div>
                    <Dialog.Title className="text-h4">
                      Delete Agent
                    </Dialog.Title>
                    <p className="text-body-sm mt-0.5">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Body */}
                <p className="text-[14px] text-[#52525B] leading-[1.6] mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-[#18181B]">{agent?.name}</span>?
                  All associated data will be permanently removed.
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onClose}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn !bg-[#DC2626] !border-[#DC2626] !text-white hover:!bg-[#B91C1C] hover:!border-[#B91C1C]"
                    onClick={onConfirm}
                    disabled={isDeleting}
                  >
                    {isDeleting && <div className="loading-spinner !w-4 !h-4 !border-white/30 !border-t-white" />}
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteAgentModal;
