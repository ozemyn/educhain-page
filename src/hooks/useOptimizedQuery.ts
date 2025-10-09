import { useQuery, UseQueryOptions, QueryClient } from '@tanstack/react-query';
import { cache } from '../utils/cache';
import { api } from '../utils/api';

// 创建持久化的QueryClient
export const createPersistentQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分钟
        gcTime: 10 * 60 * 1000, // 10分钟 (原cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
};

// 优化的查询Hook，结合localStorage缓存
export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: {
    cacheTTL?: number;
    enablePersistentCache?: boolean;
    staleTime?: number;
    enabled?: boolean;
  } = {}
) {
  const { cacheTTL = 5 * 60 * 1000, enablePersistentCache = true, ...queryOptions } = options;
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const cacheKey = queryKey.join('_');
      
      // 尝试从localStorage获取
      if (enablePersistentCache) {
        const cached = cache.get<T>(cacheKey);
        if (cached) {
          console.log(`Persistent cache hit for ${cacheKey}`);
          return cached;
        }
      }
      
      // 执行查询
      const result = await queryFn();
      
      // 存储到localStorage
      if (enablePersistentCache) {
        cache.set(cacheKey, result, cacheTTL);
      }
      
      return result;
    },
    ...queryOptions,
  });
}

// 定义API响应类型
interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  bio?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LeaderboardUser {
  userId: string;
  username: string;
  contributionScore: number;
  contributionCount: number;
  totalViews: number;
  totalLikes: number;
  rank: number;
}

interface Content {
  id: string;
  title: string;
  summary?: string;
  author: string;
  createdAt: string;
}

// 常用API查询Hooks
export const useAuthMe = () => {
  return useOptimizedQuery<User>(
    ['auth', 'me'],
    () => api.get<User>('/api/auth/me'),
    {
      cacheTTL: 10 * 60 * 1000, // 10分钟
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useUserStats = (userId: string) => {
  return useOptimizedQuery(
    ['users', userId, 'stats'],
    () => api.get(`/api/users/${userId}/stats`),
    {
      cacheTTL: 5 * 60 * 1000, // 5分钟
      enabled: !!userId,
    }
  );
};

export const useLeaderboard = () => {
  return useOptimizedQuery<LeaderboardUser[]>(
    ['contributions', 'leaderboard'],
    () => api.get<LeaderboardUser[]>('/api/contributions/leaderboard'),
    {
      cacheTTL: 2 * 60 * 1000, // 2分钟
    }
  );
};

export const useContent = () => {
  return useOptimizedQuery<Content[]>(
    ['content'],
    () => api.get<Content[]>('/api/content'),
    {
      cacheTTL: 5 * 60 * 1000, // 5分钟
    }
  );
};