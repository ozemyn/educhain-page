// 性能监控工具
export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, number[]> = new Map();

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    // 记录API请求时间
    recordApiCall(endpoint: string, duration: number): void {
        if (!this.metrics.has(endpoint)) {
            this.metrics.set(endpoint, []);
        }
        this.metrics.get(endpoint)!.push(duration);

        // 只保留最近100次记录
        const records = this.metrics.get(endpoint)!;
        if (records.length > 100) {
            records.shift();
        }
    }

    // 获取API性能统计
    getApiStats(endpoint: string): { avg: number; min: number; max: number; count: number } | null {
        const records = this.metrics.get(endpoint);
        if (!records || records.length === 0) return null;

        const avg = records.reduce((sum, time) => sum + time, 0) / records.length;
        const min = Math.min(...records);
        const max = Math.max(...records);

        return { avg, min, max, count: records.length };
    }

    // 获取所有API统计
    getAllStats(): Record<string, any> {
        const stats: Record<string, any> = {};

        Array.from(this.metrics.entries()).forEach(([endpoint, records]) => {
            if (records.length > 0) {
                stats[endpoint] = this.getApiStats(endpoint);
            }
        });

        return stats;
    }

    // 检测慢请求
    getSlowRequests(threshold: number = 1000): Array<{ endpoint: string; avgTime: number }> {
        const slowRequests: Array<{ endpoint: string; avgTime: number }> = [];

        Array.from(this.metrics.entries()).forEach(([endpoint, records]) => {
            if (records.length > 0) {
                const avg = records.reduce((sum: number, time: number) => sum + time, 0) / records.length;
                if (avg > threshold) {
                    slowRequests.push({ endpoint, avgTime: avg });
                }
            }
        });

        return slowRequests.sort((a, b) => b.avgTime - a.avgTime);
    }

    // 清除统计数据
    clear(): void {
        this.metrics.clear();
    }

    // 导出性能报告
    exportReport(): string {
        const stats = this.getAllStats();
        const slowRequests = this.getSlowRequests();

        const report = {
            timestamp: new Date().toISOString(),
            totalEndpoints: Object.keys(stats).length,
            stats,
            slowRequests,
            cacheStats: this.getCacheStats()
        };

        return JSON.stringify(report, null, 2);
    }

    // 获取缓存统计
    private getCacheStats(): any {
        const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('educhain_'));
        const totalSize = cacheKeys.reduce((size, key) => {
            return size + (localStorage.getItem(key)?.length || 0);
        }, 0);

        return {
            totalKeys: cacheKeys.length,
            totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
            keys: cacheKeys
        };
    }
}

// 性能装饰器
export function measurePerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const monitor = PerformanceMonitor.getInstance();

    descriptor.value = async function (...args: any[]) {
        const start = performance.now();
        try {
            const result = await method.apply(this, args);
            const duration = performance.now() - start;
            monitor.recordApiCall(propertyName, duration);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            monitor.recordApiCall(`${propertyName}_error`, duration);
            throw error;
        }
    };
}

// React Hook for performance monitoring
export const usePerformanceMonitor = () => {
    const monitor = PerformanceMonitor.getInstance();

    const recordApiCall = (endpoint: string, duration: number) => {
        monitor.recordApiCall(endpoint, duration);
    };

    const getStats = () => monitor.getAllStats();
    const getSlowRequests = (threshold?: number) => monitor.getSlowRequests(threshold);
    const exportReport = () => monitor.exportReport();

    return {
        recordApiCall,
        getStats,
        getSlowRequests,
        exportReport
    };
};

export const performanceMonitor = PerformanceMonitor.getInstance();