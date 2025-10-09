'use client';

import { ReactNode, useState } from 'react';
import { UserHeader } from '@/components/user/UserHeader';
import { UserNavigation } from '@/components/user/UserNavigation';
import { UserSidebar } from '@/components/user/UserSidebar';
import { UserCenter } from '@/components/user/UserCenter';
import { UserBottomNav } from '@/components/user/UserBottomNav';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

interface UserLayoutProps {
  children: ReactNode;
}

function UserLayoutContent({ children }: UserLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userCenterOpen, setUserCenterOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    if (userCenterOpen) setUserCenterOpen(false);
  };

  const handleUserCenterToggle = () => {
    setUserCenterOpen(!userCenterOpen);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleUserCenterClose = () => {
    setUserCenterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
      {/* 固定在顶部的导航区域 */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* 顶部导航栏 */}
        <div className="w-full">
          <UserHeader 
            onSidebarToggle={handleSidebarToggle}
            onUserCenterToggle={handleUserCenterToggle}
          />
        </div>
        
        {/* 桌面端水平导航 - 固定在顶部，位于UserHeader下方 */}
        <div className="hidden lg:block w-full">
          <UserNavigation />
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className={`flex flex-1 ${isAuthenticated ? 'pt-32 lg:pt-48' : 'pt-20 lg:pt-20'}`}>
        {/* 侧边栏 - 仅在移动端显示 */}
        <div className="lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
          <UserSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        </div>
        
        {/* 用户中心 */}
        <UserCenter isOpen={userCenterOpen} onClose={handleUserCenterClose} />

        {/* 主内容区 - 桌面端占据整个宽度，移动端为内容留出空间 */}
        <main className="flex-1 w-full container-responsive py-6 pb-20 lg:pb-6 lg:pl-0">
          {children}
        </main>
      </div>

      {/* 移动端底部导航 */}
      <UserBottomNav />
    </div>
  );
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <AuthProvider>
      <UserLayoutContent>{children}</UserLayoutContent>
    </AuthProvider>
  );
}