import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { logoutUser, getUserData } from '../../services/authService';

export default function AdminHeader() {
  const userData = getUserData();
  const adminName = userData?.ten || 'Admin';

  const handleLogout = () => {
    logoutUser();
    toast.success('Đã đăng xuất!');
  };

  const getHeaderTabNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-block py-3 px-4 text-base font-medium border-b-2 transition-colors duration-150 ${
      isActive
        ? 'text-blue-600 border-blue-600'
        : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30"> {/* Bỏ p-4 nếu các phần tử con đã có padding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200"> {/* Header chính */}
          <Link to="/" className="text-xl font-bold text-gray-800">agency-me</Link>
          <div className="flex items-center space-x-3">
            <img src="https://png.pngtree.com/png-vector/20191110/ourlarge/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg" alt="User Avatar" className="w-8 h-8 rounded-full object-cover"/>
            <span className="text-sm font-medium text-gray-700">{adminName}</span>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-2 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* --- Tabs điều hướng (Nếu là chung cho nhiều trang admin) --- */}
        <nav className="border-b border-gray-200 bg-white px-6"> {/* Thêm px-6 cho padding nhất quán */}
          <ul className="flex space-x-4 -mb-px"> {/* Dùng space-x thay vì mr-2 trên li */}
            <li>
              {/* Sử dụng NavLink để tự động xử lý active state */}
              <NavLink to="/agency" className={getHeaderTabNavLinkClass}>
                Đại lý
              </NavLink>
            </li>
            <li>
              <NavLink to="/type-agency/create" className={getHeaderTabNavLinkClass}> {/* Ví dụ đường dẫn */}
                Loại đại lý
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/regulations" className={getHeaderTabNavLinkClass}> {/* Ví dụ đường dẫn */}
                Thay đổi quy định
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
  );
}
