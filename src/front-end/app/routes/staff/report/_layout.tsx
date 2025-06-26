import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Toaster, toast } from 'react-hot-toast';

import StaffHeader from '../../../components/layout/staffHeader';
import StaffReportSidebar from '../../../components/layout/staffReportSideBar';
import { isAuthenticated, getUserRole, getProtectedData, logoutUser } from '../../../services/authService';

export default function StaffReportSectionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
        const checkAuth = async () => {
      
          if (!isAuthenticated()) {
            toast.error('Bạn cần đăng nhập để truy cập trang này!');
            navigate('/', { state: { from: location }, replace: true });
            return;
          }
      
          const role = getUserRole();
          if (role !== 'staff') {
            toast.error('Bạn không có quyền truy cập trang này!');
            navigate('/admin/agency/lookup', { replace: true });
            return;
          }
      
          try {
            const result = await getProtectedData();
            setIsAuthChecked(true);
          } catch (error) {
            logoutUser();
            toast.error('Phiên đăng nhập đã hết hạn!');
            navigate('', { replace: true }); // CHỖ NÀY CẦN ĐỔI navigate('', ...) → navigate('/')
          }
        };
      
        checkAuth();
      }, [navigate, location]);

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Toaster position="top-center" />
      </div>
    );
  }

  if (!isAuthenticated()) return <Toaster position="top-center" />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <StaffHeader />
      <div className="flex flex-1 overflow-hidden">
        <StaffReportSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
