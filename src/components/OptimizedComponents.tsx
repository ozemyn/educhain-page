import React, { memo, useMemo, useCallback } from 'react';
import { useAuthMe, useLeaderboard, useContent } from '../hooks/useOptimizedQuery';

// 定义组件类型
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

// 用户信息组件 - 使用缓存
const UserProfile = memo(() => {
  const { data: user, isLoading, error } = useAuthMe();

  if (isLoading) return <div className="animate-pulse">加载中...</div>;
  if (error) return <div className="text-red-500">加载失败</div>;
  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <img 
        src={user.avatar_url || '/default-avatar.png'} 
        alt={user.username}
        className="w-8 h-8 rounded-full"
      />
      <span className="font-medium">{user.username}</span>
    </div>
  );
});

// 排行榜组件 - 使用缓存和虚拟化
const Leaderboard = memo(() => {
  const { data: leaderboard, isLoading } = useLeaderboard();

  const memoizedLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    return leaderboard.slice(0, 10); // 只显示前10名
  }, [leaderboard]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-12 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {memoizedLeaderboard.map((user, index) => (
        <LeaderboardItem key={user.userId} user={user} rank={index + 1} />
      ))}
    </div>
  );
});

// 排行榜项目组件 - 使用memo避免不必要的重渲染
const LeaderboardItem = memo(({ user, rank }: { user: LeaderboardUser; rank: number }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <span className="font-bold text-lg text-blue-600">#{rank}</span>
        <span className="font-medium">{user.username}</span>
      </div>
      <div className="text-right">
        <div className="font-semibold">{user.contributionScore} 分</div>
        <div className="text-sm text-gray-500">{user.contributionCount} 贡献</div>
      </div>
    </div>
  );
});

// 内容列表组件 - 使用虚拟滚动
const ContentList = memo(() => {
  const { data: content, isLoading } = useContent();

  const handleItemClick = useCallback((id: string) => {
    // 处理点击事件
    console.log('Content clicked:', id);
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ContentSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {content?.map((item) => (
        <ContentItem 
          key={item.id} 
          content={item} 
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
});

// 内容项组件
const ContentItem = memo(({ content, onClick }: { content: Content; onClick: (id: string) => void }) => {
  const handleClick = useCallback(() => {
    onClick(content.id);
  }, [content.id, onClick]);

  return (
    <div 
      className="p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-3">{content.summary}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>作者: {content.author}</span>
        <span>{content.createdAt}</span>
      </div>
    </div>
  );
});

// 骨架屏组件
const ContentSkeleton = memo(() => (
  <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-3"></div>
    <div className="flex justify-between">
      <div className="h-3 bg-gray-200 rounded w-20"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
));

// 导出所有组件
export {
  UserProfile,
  Leaderboard,
  ContentList,
  LeaderboardItem,
  ContentItem,
  ContentSkeleton
};