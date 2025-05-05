import React, { type InputHTMLAttributes } from 'react';

// Định nghĩa kiểu cho props, kế thừa các thuộc tính của input HTML
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Label là bắt buộc
  id: string;    // id là bắt buộc để liên kết label và input
  error?: string; // Thông báo lỗi là tùy chọn
}

export function Input({ label, id, error, className, ...rest }: InputProps) {
  const errorId = `${id}-error`; // Tạo ID duy nhất cho thông báo lỗi

  return (
    // Container cho label, input, và thông báo lỗi
    // mb-5 tạo khoảng cách dưới cho mỗi field
    <div className="mb-5">
      <label
        htmlFor={id} // Liên kết label với input bằng id
        className="block text-sm font-medium text-gray-700 mb-1" // Styling cho label
      >
        {label}
      </label>
      <input
        id={id}
        // Các class CSS cơ bản và class được truyền từ ngoài vào (className)
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm disabled:bg-gray-100 ${
          error // Nếu có lỗi, thêm class border màu đỏ
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            // Ngược lại, dùng border xám và focus màu xanh mặc định
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${className || ''}`} // Cho phép thêm class tùy chỉnh từ bên ngoài
        // Thuộc tính aria để cải thiện khả năng truy cập (Accessibility)
        aria-describedby={error ? errorId : undefined} // Mô tả input bằng thông báo lỗi nếu có
        aria-invalid={!!error} // Đánh dấu input là không hợp lệ nếu có lỗi
        {...rest} // Truyền các props còn lại (như type, value, onChange, disabled, name, required, etc.)
      />
      {/* Hiển thị thông báo lỗi nếu prop 'error' được truyền vào và có giá trị */}
      {error && (
        <p id={errorId} className="text-red-600 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}