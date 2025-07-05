// src/front-end/app/components/ui/Dialog.tsx (PHIÊN BẢN ĐÃ SỬA)

// Bước 1: Thêm import 'ReactNode'
import type { ReactNode } from 'react';

// Bước 2: Thêm 'children' vào interface DialogProps
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode; // <--- THÊM DÒNG NÀY
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    // Backdrop overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      {/* Dialog Box */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"> {/* Thêm width để giới hạn kích thước */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="mt-4">
          {/* Bước 3: Render prop 'children' ở đây */}
          {children}
        </div>
      </div>
    </div>
  );
}