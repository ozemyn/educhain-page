'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { User } from '@/types/user';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error('解析用户数据失败:', error);
      router.push('/admin/login');
      return;
    }

    // 只有在所有检查通过后才设置加载状态为false
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container-responsive">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              管理员仪表板
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              欢迎回来，{user?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="glass-button text-red-600 hover:text-red-700"
          >
            退出登录
          </button>
        </div>

        {/* 仪表板内容 */}
        <div className="grid-responsive">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              用户管理
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              管理系统用户和权限
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              内容审核
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              审核用户提交的知识内容
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              代币管理
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              管理激励代币和分发规则
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              区块链监控
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              监控私有区块链状态
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}