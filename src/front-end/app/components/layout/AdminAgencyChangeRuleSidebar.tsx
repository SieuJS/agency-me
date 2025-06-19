import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function AdminChangeRuleSidebar() {
  const getSidebarNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ease-in-out group ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-medium shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 p-5 space-y-4">
      <div className="space-y-1">
        <NavLink to="/admin/regulations/change-rule-agency" className={getSidebarNavLinkClass}>
          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Về loại đại lý và đại lý</span>
        </NavLink>
      </div>

      <div className="space-y-1">
        <NavLink to="/admin/regulations/change-rule-item" className={getSidebarNavLinkClass}>
          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Về thông tin mặt hàng, tiền nợ</span>
        </NavLink>
      </div>
            <div className="space-y-1">
        <NavLink to="/admin/regulations/change-rule-price" className={getSidebarNavLinkClass}>
          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Về đơn giá bán của từng loại mặt hàng</span>
        </NavLink>
      </div>

      <div className="space-y-1">
        <NavLink to="/admin/regulations/change-rule-debt" className={getSidebarNavLinkClass}>
          <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Về tiền nợ tối đa của từng loại đại lý</span>
        </NavLink>
      </div>
    </aside>
  );
}
