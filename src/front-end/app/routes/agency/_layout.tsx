import React from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { Search, FileText, Trash2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const pathname = location.pathname;

  const getSidebarNavLinkClass = (to: string): string => {
    const isActive = pathname === to || (to !== '/agency' && pathname.startsWith(to));
    return `flex items-center px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ease-in-out group ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-medium shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- HEADER --- */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-gray-800">agency-me</div>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-gray-700 font-semibold">Admin</span>
          </div>
        </div>

        {/* --- Tabs điều hướng --- */}
<nav className="border-b border-gray-300 bg-white px-4">
  <ul className="flex space-x-4">
    <li>
      <Link
        to="/admin/dai-ly"
        className={`inline-block py-3 px-4 text-base font-medium border-b-2 transition-colors duration-150 ${
          pathname.startsWith('/agency/lookup') || pathname.startsWith('/admin/agency')
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
        }`}
      >
        Đại lý
      </Link>
    </li>
    <li>
      <Link
        to="/admin/loai-dai-ly"
        className={`inline-block py-3 px-4 text-base font-medium border-b-2 transition-colors duration-150 ${
          pathname.startsWith('/admin/loai-dai-ly')
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
        }`}
      >
        Loại đại lý
      </Link>
    </li>
    <li>
      <Link
        to="/admin/quy-dinh"
        className={`inline-block py-3 px-4 text-base font-medium border-b-2 transition-colors duration-150 ${
          pathname.startsWith('/admin/quy-dinh')
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
        }`}
      >
        Thay đổi quy định
      </Link>
    </li>
  </ul>
</nav>

      </header>

      {/* --- MAIN BODY --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 p-5 space-y-4">
          <div className="space-y-1">
            <Link to="/agency/lookup" className={getSidebarNavLinkClass('/agency/lookup')}>
              <Search className="w-5 h-5 mr-3 flex-shrink-0 text-slate-700" />
              <span className="truncate">Tra cứu đại lý</span>
            </Link>
          </div>
          <div className="space-y-1">
            <Link to="/agency/add" className={getSidebarNavLinkClass('/agency/add')}>
              <FileText className="mr-2 h-4 w-4" />
              <span className="truncate">Tiếp nhận đại lý</span>
            </Link>
          </div>
         {/* Tra cứu phiếu xuất hàng*/}
           <div className="space-y-1">
            <Link to="/agency/" className={getSidebarNavLinkClass('/agency/')}>
              <Search className="w-5 h-5 mr-3 flex-shrink-0 text-slate-700" />
              <span className="truncate">Tra cứu phiếu xuất hàng</span>
            </Link>
          </div>
            <div className="space-y-1">
            <Link to="/agency/export-slips-create" className={getSidebarNavLinkClass('/agency/export-slips-create')}>
              <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">Lập phiếu xuất hàng</span>
            </Link>
          </div>
        </aside>

        {/* --- NỘI DUNG CHÍNH --- */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
