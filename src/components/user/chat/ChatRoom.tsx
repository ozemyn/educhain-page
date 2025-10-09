'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { useChat } from '../../../hooks/useChat';

/**
 * 聊天室组件 - 显示聊天室界面
 */
export default function ChatRoom() {
  const { messages, sendMessage, isConnected, currentRoom } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // 按Enter发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="h-full flex flex-col">
      <GlassCard className="flex-1 p-4">
        <div className="flex flex-col h-full">
          {/* 聊天室标题 */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">综合讨论</h2>
                <p className="text-sm text-white/70">欢迎大家交流知识和经验</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-white/70">
                  {isConnected ? '已连接' : '连接中...'}
                </span>
              </div>
            </div>
          </div>

          {/* 消息列表区域 */}
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-white/50 py-8">
                  <p>暂无消息，开始聊天吧！</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {message.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          {message.user?.username || '未知用户'}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-white">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 消息输入区域 */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                disabled={!isConnected || !currentRoom}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!isConnected || !currentRoom || !inputMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                发送
              </button>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-400 mt-2">连接断开，正在重连...</p>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}