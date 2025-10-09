'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SidebarToggle } from './UserSidebar';
import { useAuth } from '@/contexts/AuthContext';
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface UserHeaderProps {
  onSidebarToggle: () => void;
  onUserCenterToggle: () => void;
}

export function UserHeader({ onSidebarToggle, onUserCenterToggle }: UserHeaderProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/user/knowledge?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="glass-nav p-4">
      <div className="container-responsive">
        <div className="flex items-center justify-between">
          {/* 左侧：汉堡菜单按钮和网站标题 */}
          <div className="flex items-center space-x-4">
            <SidebarToggle onClick={onSidebarToggle} />
            {/* 桌面端显示"知识分享社区"文字，移动端隐藏 */}
            <Link href="/user" className="hidden lg:block">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                EduChain
              </h1>
            </Link>
          </div>

          {/* 中间：搜索框（桌面端显示） */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="搜索知识内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>
          
          {/* 右侧：操作按钮 */}
          <div className="flex items-center space-x-3">
            {/* 移动端搜索按钮 - 仅在移动端显示，但根据需求隐藏 */}
            <button className="lg:hidden glass-button p-2 rounded-full hidden">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                {/* 通知按钮 */}
                <button 
                  onClick={onUserCenterToggle}
                  className="glass-button p-2 rounded-full relative"
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* 用户头像按钮 */}
                <button 
                  onClick={onUserCenterToggle}
                  className="glass-button p-1 rounded-full"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0)?.toUpperCase() || '用'}
                    </span>
                  </div>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/user/login">
                  <button className="glass-button px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    登录
                  </button>
                </Link>
                <Link href="/user/register">
                  <button className="glass-button px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
                    注册
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 移动端搜索框 - 仅在移动端显示，但根据需求隐藏 */}
        <div className="lg:hidden mt-4 hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="搜索知识内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </form>
        </div>
      </div>
    </header>
  );
}