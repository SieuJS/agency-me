// src/front-end/app/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../services/authService';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'staff' | string>; // Kiểu cụ thể hơn cho allowedRoles
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const userRole = getUserRole(); // userRole giờ là 'admin', 'staff', hoặc null/string khác

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    toast.error("Bạn không có quyền truy cập trang này.");
    // Điều hướng về trang phù hợp dựa trên role thực tế của họ
    if (userRole === 'admin') return <Navigate to="/admin/agency-lookup" replace />;
    if (userRole === 'staff') return <Navigate to="/staff/home" replace />;
    // Nếu role không xác định, về trang login hoặc trang lỗi
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;