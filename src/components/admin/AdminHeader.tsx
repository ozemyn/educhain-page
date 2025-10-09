'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="glass-nav p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 移动端菜单按钮 */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            <span className="hidden sm:inline">EduChain - 管理端</span>
            <span className="sm:hidden">管理端</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="relative group">
            <GlassCard className="p-2 cursor-pointer" hover={false}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {admin?.username?.charAt(0)?.toUpperCase() || '管'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {admin?.username || '管理员'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {admin?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </GlassCard>
            
            {/* 下拉菜单 */}
            <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <GlassCard className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  退出登录
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}