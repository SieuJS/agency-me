import React, { type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner'; // Import Spinner để hiển thị khi loading

// Kiểu props cho Button, kế thừa thuộc tính của button HTML
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean; // Prop tùy chọn để hiển thị trạng thái loading
}

export function Button({
  children,        // Nội dung bên trong nút 
  className,
  isLoading = false, // Mặc định không loading
  disabled = false,  // Mặc định không disabled
  ...rest          // Các props khác của button (type, onClick, ...)
}: ButtonProps) {

  // Nút sẽ bị vô hiệu hóa nếu đang loading HOẶC nếu prop 'disabled' được truyền là true
  const isEffectivelyDisabled = isLoading || disabled;

  return (
    <button
      // Các class CSS cơ bản và class được truyền từ ngoài vào
      className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out ${className || ''}`}
      // Đặt thuộc tính disabled dựa trên tính toán ở trên
      disabled={isEffectivelyDisabled}
      {...rest} // Truyền các props còn lại
    >
      {/* Nếu đang loading, hiển thị Spinner, ngược lại hiển thị nội dung (children) */}
      {isLoading ? <Spinner /> : children}
    </button>
  );
}