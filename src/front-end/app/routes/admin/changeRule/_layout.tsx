import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Toaster, toast } from 'react-hot-toast';
import AdminHeader from '../../../components/layout/header';
import AdminChangeRuleSidebar from '../../../components/layout/AdminAgencyChangeRuleSidebar';
import { isAuthenticated, getUserRole, getProtectedData, logoutUser} from '../../../services/authService';

export default function AdminChangeRuleSectionLayout() {
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
    const checkAuth = async () => {
  
      if (!isAuthenticated()) {
        toast.error('Bạn cần đăng nhập để truy cập trang này!');
        navigate('/', { state: { from: location }, replace: true });
        return;
      }
  
      const role = getUserRole();
      if (role !== 'admin') {
        toast.error('Bạn không có quyền truy cập trang này!');
        navigate('/staff/agency/lookup', { replace: true });
        return;
      }
  
      try {
        const result = await getProtectedData();
        setIsClient(true);
      } catch (error) {
        logoutUser();
        toast.error('Phiên đăng nhập đã hết hạn!');
        navigate('', { replace: true }); // CHỖ NÀY CẦN ĐỔI navigate('', ...) → navigate('/')
      }
    };
  
    checkAuth();
  }, [navigate, location]);

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
