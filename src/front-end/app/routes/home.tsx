// src/front-end/app/routes/home.tsx

// *** SỬA LỖI: Import từ 'react-router' ***
import { Link } from "react-router";

// --- LOẠI BỎ PHẦN GÂY LỖI ---
// import type { Route } from "../+types/home"; // Xóa
// export const meta... // Xóa hoặc comment lại hàm meta

// --- Component chính ---
export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Đăng nhập thành công!</h1>
            <p className="text-lg text-gray-700 mb-8">Chào mừng đến trang Home.</p>
            <Link
                to="/" // Đường dẫn quay lại trang login
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
            >
                Quay lại Đăng nhập
            </Link>
        </div>
    );
}