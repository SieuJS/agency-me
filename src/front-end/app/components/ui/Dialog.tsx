import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function Dialog({ isOpen, onClose, title, message }: DialogProps) {
  if (!isOpen) return null;

  return (
    // Backdrop overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      {/* Dialog Box */}
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}