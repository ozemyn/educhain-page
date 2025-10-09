import { cache } from './cache';

export interface ApiOptions extends Omit<RequestInit, 'cache'> {
  cache?: boolean;
  cacheTTL?: number;
  cacheKey?: string;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getCacheKey(url: string, options?: ApiOptions): string {
    if (options?.cacheKey) return options.cacheKey;
    
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `api_${method}_${url}_${btoa(body).slice(0, 10)}`;
  }

  private async request<T>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<T> {
    const { cache: useCache = false, cacheTTL = 5 * 60 * 1000, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(endpoint, options);

    // 对于GET请求，尝试从缓存获取
    if (useCache && (!fetchOptions.method || fetchOptions.method === 'GET')) {
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${endpoint}`);
        return cached;
      }
    }

    // 添加认证头
    const token = localStorage.getItem('educhain_token');
    const headers = {
      ...this.defaultHeaders,
      ...fetchOptions.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // 缓存成功的GET请求结果
      if (useCache && (!fetchOptions.method || fetchOptions.method === 'GET')) {
        cache.set(cacheKey, data, cacheTTL);
        console.log(`Cached ${endpoint} for ${cacheTTL}ms`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET请求 - 默认启用缓存
  async get<T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'GET',
      cache: options.cache !== false // 默认启用缓存
    });
  }

  // POST请求 - 默认不缓存
  async post<T>(endpoint: string, data?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      cache: false
    });
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      cache: false
    });
  }

  // DELETE请求
  async delete<T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      cache: false
    });
  }

  // 清除特定端点的缓存
  clearCache(endpoint: string, options?: ApiOptions): void {
    const cacheKey = this.getCacheKey(endpoint, options);
    cache.remove(cacheKey);
  }

  // 清除所有API缓存
  clearAllCache(): void {
    cache.clear();
  }
}

export const api = new ApiClient();