import React from 'react';
import { Outlet } from 'react-router';
import AdminHeader from '../../../components/layout/header';
import AdminChangeRuleSidebar from '../../../components/layout/AdminAgencyChangeRuleSidebar';

export default function AdminChangeRuleSectionLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminChangeRuleSidebar/>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
