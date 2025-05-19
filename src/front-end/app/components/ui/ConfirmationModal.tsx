// app/components/ConfirmationModal.tsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Tiếp tục', // Default to new text
  cancelButtonText = 'Hủy',     // Default to new text
}: ConfirmationModalProps) {
  // Styles to match the provided image
  const confirmBtnClasses = "inline-flex justify-center rounded-md border border-transparent px-6 py-2.5 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 transition-colors";
  const cancelBtnClasses = "inline-flex justify-center rounded-md border border-transparent px-6 py-2.5 text-sm font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-colors";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Backdrop style to match Figma (lighter) */}
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-slate-100 p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-slate-800"
                >
                  {title}
                </Dialog.Title>
                
                <div className="mt-4"> {/* Space between title and message */}
                  <div className="text-sm text-slate-600">
                    {message}
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4"> {/* Space above buttons and between buttons */}
                  <button
                    type="button"
                    className={cancelBtnClasses}
                    onClick={onClose}
                  >
                    {cancelButtonText}
                  </button>
                  <button
                    type="button"
                    className={confirmBtnClasses}
                    onClick={() => {
                      onConfirm();
                      onClose(); 
                    }}
                  >
                    {confirmButtonText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}