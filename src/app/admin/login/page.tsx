'use client';

import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-glass-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-glass-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-glass-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* 主题切换按钮 */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <GlassCard className="p-6 sm:p-8 hover:scale-100">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              管理员登录
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              区块链知识社区管理系统
            </p>
          </div>

          {/* 登录表单 */}
          <AdminLoginForm />
        </GlassCard>

        {/* 底部信息 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            EduChain - 去中心化知识分享与激励平台
          </p>
        </div>
      </div>
    </div>
    </AdminAuthProvider>
  );
}