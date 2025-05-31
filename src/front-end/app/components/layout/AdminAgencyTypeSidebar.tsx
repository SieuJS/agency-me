import React from 'react';
import { NavLink } from 'react-router-dom';
// Import icons Thêm và xóa loại đại lý
import { PlusSquare, Trash2 } from 'lucide-react';

export default function AdminAgencyTypeSidebar() {
  const getSidebarNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ease-in-out group ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-medium shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 p-5 space-y-4">
      <div className="space-y-1">
        <NavLink to="/type-agency/create" className={getSidebarNavLinkClass}>
          <PlusSquare className="w-5 h-5 mr-3 flex-shrink-0 text-slate-700" />
          <span className="truncate">Thêm loại đại lý</span>
        </NavLink>
      </div>
      <div className="space-y-1">
        <NavLink to="/angency-type/delete" className={getSidebarNavLinkClass}>
          <Trash2 className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Xóa loại đại lý</span>
        </NavLink>
      </div>
      
    </aside>
    );
}