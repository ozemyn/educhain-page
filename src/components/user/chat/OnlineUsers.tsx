'use client';

import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { useChat } from '../../../hooks/useChat';

/**
 * 在线用户组件 - 显示当前在线的用户列表
 */
export default function OnlineUsers() {
  const { onlineUsers } = useChat();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'away':
        return '离开';
      case 'busy':
        return '忙碌';
      default:
        return '离线';
    }
  };

  return (
    <div className="h-full">
      <GlassCard className="h-full p-4">
        <div className="flex flex-col h-full">
          {/* 标题 */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-white">在线用户</h2>
            <p className="text-sm text-white/70">{onlineUsers.length} 人在线</p>
          </div>

          {/* 用户列表 */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {onlineUsers.length === 0 ? (
              <div className="text-center text-white/50 py-8">
                <p>暂无在线用户</p>
              </div>
            ) : (
              onlineUsers.map((user) => (
                <div key={user.userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  {/* 头像 */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      U
                    </div>
                    {/* 状态指示器 */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`}></div>
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white truncate">{user.userId}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-white/50">{getStatusText(user.status)}</span>
                      {user.currentRoom && (
                        <>
                          <span className="text-xs text-white/30">·</span>
                          <span className="text-xs text-white/50 truncate">{user.currentRoom}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}