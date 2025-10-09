'use client';

import React, { useEffect } from 'react';
import ChatRoomList from '../../../components/user/chat/ChatRoomList';
import ChatRoom from '../../../components/user/chat/ChatRoom';
import OnlineUsers from '../../../components/user/chat/OnlineUsers';
import MessageNotification from '../../../components/user/chat/MessageNotification';
import { useChat } from '../../../hooks/useChat';

/**
 * 用户端聊天页面 - 实时聊天功能主页面
 */
export default function ChatPage() {
  const { joinRoom, isConnected } = useChat();

  // 页面加载时自动加入默认聊天室
  useEffect(() => {
    if (isConnected) {
      joinRoom('general');
    }
  }, [isConnected, joinRoom]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">社区聊天</h1>
          <p className="text-white/70">与社区成员实时交流，分享知识和经验</p>
        </div>

        {/* 聊天界面布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* 左侧：聊天室列表 */}
          <div className="lg:col-span-1">
            <ChatRoomList />
          </div>

          {/* 中间：聊天室主界面 */}
          <div className="lg:col-span-2">
            <ChatRoom />
          </div>

          {/* 右侧：在线用户列表 */}
          <div className="lg:col-span-1">
            <OnlineUsers />
          </div>
        </div>
      </div>

      {/* 消息通知 */}
      <MessageNotification />
    </div>
  );
}