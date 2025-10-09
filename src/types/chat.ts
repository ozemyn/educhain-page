/**
 * 前端聊天系统类型定义
 */

// 聊天室类型
export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'system';
  createdBy: string;
  maxMembers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberCount?: number;
  unreadCount?: number;
  lastMessage?: ChatMessage;
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  replyToMessage?: ChatMessage;
}

// 用户在线状态类型
export interface UserOnlineStatus {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  socketId?: string;
  currentRoom?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  updatedAt: Date;
}