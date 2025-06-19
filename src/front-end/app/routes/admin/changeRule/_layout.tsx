import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AdminHeader from '../../../components/layout/header';
import AdminChangeRuleSidebar from '../../../components/layout/AdminAgencyChangeRuleSidebar';
import { isAuthenticated } from '../../../services/authService';

export default function AdminChangeRuleSectionLayout() {
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      navigate('/', { replace: true }); // Redirect to login
    }
  }, []);

  if (!isClient) return null; // Tránh lỗi SSR hoặc chờ xác thực

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminChangeRuleSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
