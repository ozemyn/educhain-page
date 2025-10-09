'use client';

import { ReactNode, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <AdminHeader onMenuClick={toggleSidebar} />
        <div className="flex">
          <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          <main className="flex-1 p-4 lg:p-6 lg:ml-0">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}