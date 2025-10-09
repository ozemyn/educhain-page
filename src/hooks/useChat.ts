'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { ChatRoom, ChatMessage, UserOnlineStatus } from '../types/chat';

/**
 * 聊天功能管理Hook
 * 处理聊天室、消息、在线用户等状态管理
 */
export function useChat() {
  const { socket, isConnected } = useSocket();
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserOnlineStatus[]>([]);
  const [isTyping, setIsTyping] = useState<{ [userId: string]: boolean }>({});

  // 加入聊天室
  const joinRoom = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join-room', roomId);
      setCurrentRoom(roomId);
    }
  }, [socket, isConnected]);

  // 离开聊天室
  const leaveRoom = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', roomId);
      if (currentRoom === roomId) {
        setCurrentRoom(null);
      }
    }
  }, [socket, isConnected, currentRoom]);

  // 发送消息
  const sendMessage = useCallback((content: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (socket && isConnected && currentRoom && content.trim()) {
      socket.emit('send-message', {
        roomId: currentRoom,
        content: content.trim(),
        messageType,
      });
    }
  }, [socket, isConnected, currentRoom]);

  // 开始输入
  const startTyping = useCallback(() => {
    if (socket && isConnected && currentRoom) {
      socket.emit('typing', currentRoom);
    }
  }, [socket, isConnected, currentRoom]);

  // 停止输入
  const stopTyping = useCallback(() => {
    if (socket && isConnected && currentRoom) {
      socket.emit('stop-typing', currentRoom);
    }
  }, [socket, isConnected, currentRoom]);

  // 监听Socket事件
  useEffect(() => {
    if (!socket) return;

    // 新消息
    socket.on('message:new', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // 用户上线
    socket.on('user:online', (user: UserOnlineStatus) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== user.userId);
        return [...filtered, user];
      });
    });

    // 用户下线
    socket.on('user:offline', (userId: string) => {
      setOnlineUsers(prev => prev.filter(u => u.userId !== userId));
    });

    // 用户正在输入
    socket.on('user:typing', ({ userId, username }) => {
      setIsTyping(prev => ({ ...prev, [userId]: true }));
      // 3秒后自动清除输入状态
      setTimeout(() => {
        setIsTyping(prev => ({ ...prev, [userId]: false }));
      }, 3000);
    });

    // 用户停止输入
    socket.on('user:stop-typing', ({ userId }) => {
      setIsTyping(prev => ({ ...prev, [userId]: false }));
    });

    // 错误处理
    socket.on('error', (error) => {
      console.error('聊天错误:', error);
    });

    // 清理事件监听器
    return () => {
      socket.off('message:new');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('user:typing');
      socket.off('user:stop-typing');
      socket.off('error');
    };
  }, [socket]);

  return {
    // 状态
    isConnected,
    currentRoom,
    messages,
    onlineUsers,
    isTyping,
    
    // 方法
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
  };
}