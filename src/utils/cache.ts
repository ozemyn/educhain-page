// localStorage 持久化缓存工具
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class LocalStorageCache {
  private static instance: LocalStorageCache;
  private prefix = 'educhain_';

  static getInstance(): LocalStorageCache {
    if (!LocalStorageCache.instance) {
      LocalStorageCache.instance = new LocalStorageCache();
    }
    return LocalStorageCache.instance;
  }

  // 设置缓存，支持过期时间
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  // 获取缓存
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cached: CacheItem<T> = JSON.parse(item);
      
      // 检查是否过期
      if (Date.now() > cached.expiry) {
        this.remove(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  // 删除缓存
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  // 清空所有缓存
  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  // 检查缓存是否存在且未过期
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cache = LocalStorageCache.getInstance();