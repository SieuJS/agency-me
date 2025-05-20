// src/front-end/app/components/auth/ProtectedRoute.tsx (Tạo file mới)
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router'; // Import từ react-router
import { isAuthenticated } from '../../services/authService';

interface ProtectedRouteProps {
  // children?: React.ReactNode; // Không cần children nếu dùng Outlet
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Người dùng chưa đăng nhập, chuyển hướng đến trang login
    // Lưu lại trang họ đang cố gắng truy cập để có thể quay lại sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Người dùng đã đăng nhập, cho phép truy cập route
  return <Outlet />; // Outlet sẽ render component con của route được bảo vệ
};

export default ProtectedRoute;