// API相关类型定义 - 与后端保持完全一致
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  requestId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 错误代码枚举 - 与后端保持一致
export enum ErrorCodes {
  // 认证相关 (1000-1099)
  UNAUTHORIZED = 'AUTH_1001',
  INVALID_TOKEN = 'AUTH_1002',
  TOKEN_EXPIRED = 'AUTH_1003',
  INSUFFICIENT_PERMISSIONS = 'AUTH_1004',
  
  // 用户相关 (1100-1199)
  USER_NOT_FOUND = 'USER_1101',
  USER_ALREADY_EXISTS = 'USER_1102',
  INVALID_USER_DATA = 'USER_1103',
  USER_DISABLED = 'USER_1104',
  
  // 内容相关 (1200-1299)
  CONTENT_NOT_FOUND = 'CONTENT_1201',
  CONTENT_ACCESS_DENIED = 'CONTENT_1202',
  INVALID_CONTENT_FORMAT = 'CONTENT_1203',
  CONTENT_SIZE_EXCEEDED = 'CONTENT_1204',
  
  // 区块链相关 (1300-1399)
  BLOCKCHAIN_SYNC_ERROR = 'BLOCKCHAIN_1301',
  INVALID_SIGNATURE = 'BLOCKCHAIN_1302',
  BLOCK_VALIDATION_FAILED = 'BLOCKCHAIN_1303',
  CONSENSUS_ERROR = 'BLOCKCHAIN_1304',
  
  // 代币相关 (1400-1499)
  INSUFFICIENT_BALANCE = 'TOKEN_1401',
  INVALID_TOKEN_AMOUNT = 'TOKEN_1402',
  TOKEN_TRANSFER_FAILED = 'TOKEN_1403',
  TOKEN_NOT_FOUND = 'TOKEN_1404',
  
  // 系统相关 (1500-1599)
  DATABASE_ERROR = 'SYSTEM_1501',
  EXTERNAL_SERVICE_ERROR = 'SYSTEM_1502',
  RATE_LIMIT_EXCEEDED = 'SYSTEM_1503',
  MAINTENANCE_MODE = 'SYSTEM_1504'
}

// 通知相关类型
export interface Notification {
  id: string;
  userId: string;
  type: 'token_reward' | 'content_approved' | 'comment_reply';
  title: string;
  content: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}