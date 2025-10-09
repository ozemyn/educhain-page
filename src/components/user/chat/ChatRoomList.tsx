'use client';

import React from 'react';
import { GlassCard } from '../../ui/GlassCard';

/**
 * 聊天室列表组件 - 显示可用的聊天室
 */
export default function ChatRoomList() {
  const chatRooms = [
    {
      id: 'general',
      name: '综合讨论',
      description: '社区综合讨论区',
      memberCount: 25,
      unreadCount: 3,
      lastMessage: '欢迎大家来到知识分享社区！',
      isActive: true,
    },
    {
      id: 'knowledge-sharing',
      name: '知识分享',
      description: '专门用于分享学习资料',
      memberCount: 18,
      unreadCount: 0,
      lastMessage: '我刚发布了一篇React文章',
      isActive: false,
    },
    {
      id: 'tech-support',
      name: '技术支持',
      description: '技术问题讨论和互助',
      memberCount: 12,
      unreadCount: 1,
      lastMessage: '请问如何优化区块链同步？',
      isActive: false,
    },
  ];

  return (
    <div className="h-full">
      <GlassCard className="h-full p-4">
        <div className="flex flex-col h-full">
          {/* 标题 */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-white">聊天室</h2>
          </div>

          {/* 聊天室列表 */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  room.isActive
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-white">{room.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/50">{room.memberCount}</span>
                    {room.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-1">{room.description}</p>
                <p className="text-xs text-white/50 truncate">{room.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}