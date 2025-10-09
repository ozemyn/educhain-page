'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '../../../hooks/useChat';

/**
 * 消息通知组件 - 显示新消息通知
 */
export default function MessageNotification() {
  const { messages } = useChat();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    timestamp: Date;
  }>>([]);

  // 监听新消息并显示通知
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // 检查是否是新消息（避免重复通知）
      const isNewMessage = !notifications.some(n => n.id === latestMessage.id);
      
      if (isNewMessage && latestMessage.messageType === 'text') {
        const notification = {
          id: latestMessage.id,
          message: `${latestMessage.user?.username || '用户'}: ${latestMessage.content}`,
          timestamp: new Date(),
        };
        
        setNotifications(prev => [...prev, notification]);
        
        // 3秒后自动移除通知
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 3000);
      }
    }
  }, [messages, notifications]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in-right"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium">新消息</p>
              <p className="text-xs opacity-90 truncate">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}