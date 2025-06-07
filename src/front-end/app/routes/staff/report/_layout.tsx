import React from 'react';
import { Outlet } from 'react-router';
import StaffHeader from '../../../components/layout/staffHeader';
import StaffReportSidebar from '../../../components/layout/staffReportSideBar';

export default function AdminAgencyTypeSectionLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <StaffHeader />
      <div className="flex flex-1 overflow-hidden">
        <StaffReportSidebar/>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
