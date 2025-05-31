import React, { useEffect, useState } from 'react'; // Thêm useState
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router';
import { Search, FileText, Trash2, LogOut } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { isAuthenticated, logoutUser, getUserData } from '../../services/authService';
import AdminHeader from '../../components/layout/header';
import AdminSidebar from '../../components/layout/AdminSidebar';
export default function AdminSectionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  // Thêm state để chỉ render khi đã xác thực và tránh render khi đang chuyển hướng
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('AdminLayout: User not authenticated, showing toast and redirecting to /login from:', location.pathname);
      // Hiển thị toast trước khi chuyển hướng
      toast.error('Bạn cần đăng nhập để truy cập trang này!', {
        id: 'auth-required-toast', // ID để tránh toast bị lặp lại nếu useEffect chạy nhanh
        duration: 4000,
      });
      // Sau một khoảng thời gian ngắn, thực hiện chuyển hướng
      const timer = setTimeout(() => {
        navigate('/', { state: { from: location }, replace: true });
      },0); // Chờ 1.5 giây để người dùng đọc toast
      setIsAuthChecked(true); // Đánh dấu đã kiểm tra để không render layout
      return () => clearTimeout(timer); // Cleanup timer nếu component unmount
    } else {
      setIsAuthChecked(true); // Người dùng đã xác thực, cho phép render layout
    }
  }, [navigate, location]); // Chỉ cần location vì navigate ổn định

  // Nếu chưa hoàn tất kiểm tra xác thực, không render gì cả
  if (!isAuthChecked) {
    return (
        // Có thể thêm một spinner toàn trang ở đây nếu muốn
        // Hoặc return null để không hiển thị gì trong lúc chờ toast và redirect
        <div className="flex items-center justify-center h-screen">
             <Toaster position="top-center" /> {/* Đặt Toaster ở đây để nó hiển thị ngay cả khi layout chưa render */}
        </div>
    );
  }

  // Nếu đã kiểm tra và không xác thực (useEffect ở trên sẽ xử lý redirect)
  // Dòng này để đảm bảo không render layout nếu redirect chưa kịp xảy ra
  if (!isAuthenticated() && isAuthChecked) {
      return <Toaster position="top-center" /> ; // Chỉ render Toaster để toast lỗi có thể hiển thị
  }


  // Lấy thông tin người dùng (ví dụ: để hiển thị tên)
  const userData = getUserData();
  const adminName = userData?.ten || 'Admin'; // Giả sử user object có trường 'ten'

  // Hàm xác định class cho NavLink active/inactive trong Sidebar
  const getSidebarNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ease-in-out group ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-medium shadow-sm' // Style active
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Style inactive
    }`;

  // Hàm xác định class cho NavLink active/inactive trong Header Tabs
  const getHeaderTabNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `inline-block py-3 px-4 text-base font-medium border-b-2 transition-colors duration-150 ${
      isActive
        ? 'text-blue-600 border-blue-600' // Style active
        : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300' // Style inactive
    }`;

  const handleLogout = () => {
    logoutUser();
    toast.success('Đã đăng xuất!');
    navigate('/', { replace: true });
  };

  // Nếu chưa xác thực, không render gì cả (hoặc một spinner) để tránh nháy layout
  if (!isAuthenticated()) {
    return null;
  }


  // Nếu đã xác thực và có quyền admin hoặc staff, hiển thị layout admin
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}