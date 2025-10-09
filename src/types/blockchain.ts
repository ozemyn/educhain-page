// 区块链相关类型定义 - 与后端保持完全一致
export interface Block {
  id: string;
  height: number;
  hash: string;
  previousHash?: string;
  merkleRoot: string;
  timestamp: Date;
  nonce: string;
  validatorId: string;
  transactionCount: number;
  transactions?: ContributionRecord[];
}

export interface ContributionRecord {
  id: string;
  userId: string;
  contentId?: string;
  contributionType: 'content_create' | 'content_review' | 'community_help';
  contributionValue: number;
  blockHeight?: number;
  transactionHash?: string;
  signature?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}

export interface BlockchainStatus {
  blockHeight: number;
  totalTransactions: number;
  networkStatus: string;
  consensusNodes: number;
}

export interface BlockchainContribution {
  id: string;
  userId: string;
  contributionType: string;
  contributionValue: number;
  blockHeight: number;
  transactionHash: string;
  timestamp: Date;
}

// 区块链验证相关类型
export interface VerifyContributionRequest {
  contributionId: string;
  signature: string;
}

export interface VerifyContributionResponse {
  isValid: boolean;
  blockHeight?: number;
  transactionHash?: string;
}

export interface ContributionListQuery {
  page?: number;
  limit?: number;
}

export interface ContributionListResponse {
  contributions: BlockchainContribution[];
  total: number;
}