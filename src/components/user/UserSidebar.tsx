'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '首页', href: '/user', icon: HomeIcon },
  { name: '知识内容', href: '/user/knowledge', icon: BookOpenIcon },
  { name: '我的贡献', href: '/user/contributions', icon: ChartBarIcon },
  { name: '激励代币', href: '/user/tokens', icon: CurrencyDollarIcon },
  { name: '社区聊天', href: '/user/chat', icon: ChatBubbleLeftRightIcon },
  { name: '个人中心', href: '/user/profile', icon: UserCircleIcon },
  { name: '设置', href: '/user/settings', icon: Cog6ToothIcon },
];

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <GlassCard className="h-full rounded-none border-l-0">
          <div className="flex flex-col h-full">
            {/* 侧边栏头部 */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || '用'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {user?.username || '游客'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user?.email || '未登录'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="glass-button p-2 rounded-full"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/10 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 侧边栏底部 */}
            <div className="p-4 border-t border-white/10 dark:border-white/5">
              <div className="space-y-3">
                {/* 快速统计 */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="glass-button p-2 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">代币</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">1,250</p>
                  </div>
                  <div className="glass-button p-2 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">贡献</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">89</p>
                  </div>
                </div>
                
                {/* 退出登录按钮 */}
                {user && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('userToken');
                      localStorage.removeItem('user');
                      window.location.href = '/user';
                    }}
                    className="w-full glass-button px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    退出登录
                  </button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}

// 移动端侧边栏切换按钮
export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass-button p-2 rounded-full"
      aria-label="打开侧边栏"
    >
      <Bars3Icon className="h-5 w-5" />
    </button>
  );
}