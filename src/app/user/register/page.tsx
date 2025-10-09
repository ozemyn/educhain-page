'use client';

import Link from 'next/link';
import { UserAuthLayout } from '@/components/user/UserAuthLayout';
import { UserRegisterForm } from '@/components/user/UserRegisterForm';

export default function UserRegisterPage() {
  return (
    <UserAuthLayout 
      title="用户注册" 
      subtitle="创建您的账户，加入EduChain平台"
    >
      <div className="space-y-6">
        {/* 注册表单 */}
        <UserRegisterForm />

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

        {/* 登录链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            已有账户？{' '}
            <Link 
              href="/user/login" 
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              立即登录
            </Link>
          </p>
        </div>

        {/* 服务条款 */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            注册即表示您同意我们的{' '}
            <Link 
              href="/terms" 
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              服务条款
            </Link>
            {' '}和{' '}
            <Link 
              href="/privacy" 
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </UserAuthLayout>
  );
}