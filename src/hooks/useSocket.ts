'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Socket.io连接管理Hook
 * 处理WebSocket连接、断开和重连逻辑
 */
export function useSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 创建Socket连接
    const socketUrl = url || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    const socket = socketRef.current;

    // 连接成功
    socket.on('connect', () => {
      console.log('Socket连接成功:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    // 连接断开
    socket.on('disconnect', (reason) => {
      console.log('Socket连接断开:', reason);
      setIsConnected(false);
    });

    // 连接错误
    socket.on('connect_error', (err) => {
      console.error('Socket连接错误:', err);
      setError(err.message);
      setIsConnected(false);
    });

    // 清理函数
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
  };
}