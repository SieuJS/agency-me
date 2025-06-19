import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AdminHeader from '../../../components/layout/header';
import AdminAgencyTypeSidebar from '../../../components/layout/AdminAgencyTypeSidebar';
import { isAuthenticated } from '../../../services/authService';

export default function AdminAgencyTypeSectionLayout() {
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminAgencyTypeSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
