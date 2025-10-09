// 知识内容相关类型定义 - 与后端保持完全一致
export interface Content {
  id: string;
  title: string;
  content: string;
  summary?: string;
  authorId: string;
  categoryId?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  viewCount: number;
  likeCount: number;
  tags: Tag[];
  attachments: ContentAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  usageCount: number;
}

export interface ContentAttachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface Comment {
  id: string;
  contentId: string;
  userId: string;
  parentId?: string;
  content: string;
  likeCount: number;
  status: 'active' | 'hidden' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  targetType: 'content' | 'comment';
  targetId: string;
  createdAt: Date;
}

// 内容管理相关请求类型
export interface CreateContentRequest {
  title: string;
  content: string;
  category: string;
  tags: string[];
  attachments?: File[];
}

export interface ContentListQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}

export interface ContentListResponse {
  contents: Content[];
  total: number;
  page: number;
  limit: number;
}

export interface ContentReviewRequest {
  status: 'approved' | 'rejected';
  reason?: string;
}