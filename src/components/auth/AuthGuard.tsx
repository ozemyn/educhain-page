'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cache } from '@/utils/cache';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  redirectTo = '/user/login',
  requireAuth = true 
}: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // 验证 token 是否有效（使用缓存避免重复请求）
        // 检查缓存中是否有有效的用户信息
        const cachedUser = cache.get('auth_me');
        
        if (cachedUser) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // 如果缓存中没有，则发送请求验证
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // 缓存用户信息2分钟
            cache.set('auth_me', result, 2 * 60 * 1000);
            setIsAuthenticated(true);
          } else {
            // Token 无效，清除本地存储
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } else {
          // Token 无效，清除本地存储
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('认证检查失败:', error);
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
    return <LoadingSpinner message="正在验证身份..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return null; // 重定向中，不显示内容
  }

  return <>{children}</>;
}