// 请求去重和批处理工具
class RequestOptimizer {
  private pendingRequests = new Map<string, Promise<any>>();
  private batchQueue = new Map<string, Array<{ resolve: Function; reject: Function; data: any }>>();
  private batchTimers = new Map<string, NodeJS.Timeout>();

  // 请求去重 - 相同请求只发送一次
  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      console.log(`Deduplicating request: ${key}`);
      return this.pendingRequests.get(key);
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // 批处理请求 - 将多个请求合并为一个
  async batch<T>(
    batchKey: string,
    data: any,
    batchFn: (items: any[]) => Promise<T[]>,
    delay: number = 50
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.batchQueue.has(batchKey)) {
        this.batchQueue.set(batchKey, []);
      }

      const queue = this.batchQueue.get(batchKey)!;
      queue.push({ resolve, reject, data });

      // 清除之前的定时器
      if (this.batchTimers.has(batchKey)) {
        clearTimeout(this.batchTimers.get(batchKey)!);
      }

      // 设置新的定时器
      const timer = setTimeout(async () => {
        const currentQueue = [...queue];
        this.batchQueue.set(batchKey, []);
        this.batchTimers.delete(batchKey);

        try {
          const items = currentQueue.map(item => item.data);
          const results = await batchFn(items);
          
          currentQueue.forEach((item, index) => {
            item.resolve(results[index]);
          });
        } catch (error) {
          currentQueue.forEach(item => {
            item.reject(error);
          });
        }
      }, delay);

      this.batchTimers.set(batchKey, timer);
    });
  }

  // 清理所有待处理的请求
  clear(): void {
    this.pendingRequests.clear();
    this.batchQueue.clear();
    this.batchTimers.forEach(timer => clearTimeout(timer));
    this.batchTimers.clear();
  }
}

export const requestOptimizer = new RequestOptimizer();

// 使用示例的Hook
export const useDedupedRequest = <T>(
  key: string,
  requestFn: () => Promise<T>,
  deps: any[] = []
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    requestOptimizer
      .deduplicate(key, requestFn)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [key, ...deps]);

  return { data, loading, error };
};

import React from 'react';