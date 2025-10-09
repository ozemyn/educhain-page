'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: '首页', href: '/user' },
  { name: '知识内容', href: '/user/knowledge' },
  { name: '我的贡献', href: '/user/contributions' },
  { name: '激励代币', href: '/user/tokens' },
  { name: '数据统计', href: '/user/statistics' },
  { name: '社区聊天', href: '/user/chat' },
  { name: '个人中心', href: '/user/profile' },
];

export function UserNavigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // 如果未登录，不显示导航
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="border-b border-white/10 dark:border-white/5">
      <div className="container-responsive">
        <div className="flex justify-center space-x-8 overflow-x-auto scrollbar-glass">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 hover:dark:text-gray-200'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}