'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AdminAuthGuard({ 
  children, 
  redirectTo = '/admin/login',
  requireAuth = true 
}: AdminAuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('admin');

        if (!token || !adminData) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // 验证 token 是否有效
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setIsAuthenticated(true);
          } else {
            // Token 无效，清除本地存储
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            setIsAuthenticated(false);
          }
        } else {
          // Token 无效，清除本地存储
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('管理员认证检查失败:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo, router]);

  if (isLoading) {
    return <LoadingSpinner message="正在验证管理员身份..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return null; // 重定向中，不显示内容
  }

  return <>{children}</>;
}