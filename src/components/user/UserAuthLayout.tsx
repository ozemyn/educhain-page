'use client';

import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface UserAuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function UserAuthLayout({ children, title, subtitle }: UserAuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-glass-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-glass-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-glass-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* 主题切换按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* 主要内容 */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* 头部 */}
        <div className="text-center">
          <div className="glass-card p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 表单容器 */}
        <div className="glass-card p-8">
          {children}
        </div>

        {/* 底部链接 */}
        <div className="text-center">
          <div className="glass-card p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              需要帮助？{' '}
              <a 
                href="/help" 
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                联系客服
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}