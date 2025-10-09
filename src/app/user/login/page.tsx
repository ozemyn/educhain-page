'use client';

import Link from 'next/link';
import { UserAuthLayout } from '@/components/user/UserAuthLayout';
import { UserLoginForm } from '@/components/user/UserLoginForm';

export default function UserLoginPage() {
  return (
    <UserAuthLayout
      title="用户登录"
      subtitle="登录您的账户，开始知识分享之旅"
    >
      <div className="space-y-6">
        {/* 登录表单 */}
        <UserLoginForm />

        {/* 分隔线 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/10 dark:bg-black/10 text-gray-500 dark:text-gray-400 backdrop-blur-sm rounded">
              或者
            </span>
          </div>
        </div>

        {/* 注册链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            还没有账户？{' '}
            <Link
              href="/user/register"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              立即注册
            </Link>
          </p>
        </div>

        {/* 管理员登录链接 */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            管理员用户？{' '}
            <Link
              href="/admin/login"
              className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
            >
              管理员登录
            </Link>
          </p>
        </div>
      </div>
    </UserAuthLayout>
  );
}