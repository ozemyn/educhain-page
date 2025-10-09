'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid';

const navigation = [
  { 
    name: '首页', 
    href: '/user', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid 
  },
  { 
    name: '知识', 
    href: '/user/knowledge', 
    icon: BookOpenIcon, 
    iconSolid: BookOpenIconSolid 
  },
  { 
    name: '贡献', 
    href: '/user/contributions', 
    icon: ChartBarIcon, 
    iconSolid: ChartBarIconSolid 
  },
  { 
    name: '代币', 
    href: '/user/tokens', 
    icon: CurrencyDollarIcon, 
    iconSolid: CurrencyDollarIconSolid 
  },
  { 
    name: '我的', 
    href: '/user/profile', 
    icon: UserCircleIcon, 
    iconSolid: UserCircleIconSolid 
  },
];

export function UserBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // 如果未登录，不显示底部导航
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
      <div className="glass-nav border-t border-white/10 dark:border-white/5">
        <div className="grid grid-cols-5 h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/user' && pathname.startsWith(item.href));
            const Icon = isActive ? item.iconSolid : item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center justify-center space-y-1 transition-all duration-200',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.name}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-b-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}