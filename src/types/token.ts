// 激励代币相关类型定义 - 与后端保持完全一致
export interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  distributedSupply: number;
  decimals: number;
  distributionRules: DistributionRule[];
  status: 'active' | 'paused';
  createdBy: string;
  createdAt: Date;
}

export interface DistributionRule {
  contributionType: string;
  baseReward: number;
  multipliers: {
    qualityScore?: number;
    popularityBonus?: number;
    timeBonus?: number;
  };
}

export interface TokenBalance {
  userId: string;
  tokenId: string;
  balance: number;
  lockedBalance: number;
  token: Token;
}

export interface TokenTransaction {
  id: string;
  fromUserId?: string;
  toUserId: string;
  tokenId: string;
  amount: number;
  transactionType: 'reward' | 'transfer' | 'burn';
  reason?: string;
  contributionRecordId?: string;
  blockHeight?: number;
  transactionHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

export interface TokenHolder {
  userId: string;
  username: string;
  balance: number;
  rank: number;
}

// 代币管理相关请求类型
export interface CreateTokenRequest {
  name: string;
  symbol: string;
  totalSupply: number;
  distributionRules: DistributionRule[];
}

export interface DistributeTokenRequest {
  userId: string;
  tokenId: string;
  amount: number;
  reason: string;
  contributionId?: string;
}

export interface TokenTransactionQuery {
  page?: number;
  limit?: number;
  tokenId?: string;
}

export interface TokenTransactionResponse {
  transactions: TokenTransaction[];
  total: number;
}

export interface TokenStatistics {
  totalDistributed: number;
  activeUsers: number;
  topHolders: TokenHolder[];
  distributionChart: ChartData[];
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}