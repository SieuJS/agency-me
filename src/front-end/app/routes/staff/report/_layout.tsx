import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Toaster, toast } from 'react-hot-toast';

import StaffHeader from '../../../components/layout/staffHeader';
import StaffReportSidebar from '../../../components/layout/staffReportSideBar';
import { isAuthenticated } from '../../../services/authService';

export default function StaffReportSectionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Bạn cần đăng nhập để truy cập trang này!");
      const timer = setTimeout(() => {
        navigate("/", { state: { from: location }, replace: true });
      }, 0);
      setIsAuthChecked(true);
      return () => clearTimeout(timer);
    } else {
      setIsAuthChecked(true);
    }
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
