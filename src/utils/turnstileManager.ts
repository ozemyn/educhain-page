/**
 * Turnstile 管理器
 * 用于全局管理 Turnstile 脚本加载和 widget 实例
 */

type TurnstileCallback = (token: string) => void;
type TurnstileErrorCallback = () => void;

interface TurnstileWidgetOptions {
  sitekey: string;
  callback: TurnstileCallback;
  'error-callback'?: TurnstileErrorCallback;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
}

class TurnstileManager {
  private static instance: TurnstileManager;
  private isScriptLoading: boolean = false;
  private isScriptLoaded: boolean = false;
  private loadCallbacks: Array<() => void> = [];
  private widgets: Map<string, string> = new Map(); // widgetId -> elementId
  private renderTimeout: number = 15000; // 15秒超时

  private constructor() {}

  static getInstance(): TurnstileManager {
    if (!TurnstileManager.instance) {
      TurnstileManager.instance = new TurnstileManager();
    }
    return TurnstileManager.instance;
  }

  /**
   * 加载 Turnstile 脚本
   */
  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 如果脚本已经加载完成，直接 resolve
      if (this.isScriptLoaded && typeof window !== 'undefined' && typeof window.turnstile !== 'undefined') {
        resolve();
        return;
      }

      // 检查是否在浏览器环境中
      if (typeof window === 'undefined') {
        reject(new Error('Turnstile can only be loaded in browser environment'));
        return;
      }

      // 如果脚本正在加载中，将 resolve 添加到回调队列
      if (this.isScriptLoading) {
        this.loadCallbacks.push(resolve);
        return;
      }

      // 开始加载脚本
      this.isScriptLoading = true;
      
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      
      // 添加全局回调函数
      (window as any).onloadTurnstileCallback = () => {
        this.isScriptLoaded = true;
        this.isScriptLoading = false;
        
        // 执行所有等待的回调
        this.loadCallbacks.forEach(callback => callback());
        this.loadCallbacks = [];
        
        resolve();
      };
      
      script.onload = () => {
        // 如果全局回调没有被触发，5秒后手动触发
        setTimeout(() => {
          if (!this.isScriptLoaded) {
            (window as any).onloadTurnstileCallback();
          }
        }, 5000);
      };
      
      script.onerror = () => {
        this.isScriptLoading = false;
        this.loadCallbacks = [];
        reject(new Error('Failed to load Turnstile script'));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 渲染 Turnstile widget
   */
  async render(
    element: string | HTMLElement, 
    options: TurnstileWidgetOptions
  ): Promise<string> {
    // 设置默认选项
    const defaultOptions: TurnstileWidgetOptions = {
      retry: 'auto',
      'retry-interval': 8000,
      ...options
    };
    
    try {
      // 确保脚本已加载
      await this.loadScript();
      
      // 检查 window.turnstile 是否存在
      if (typeof window === 'undefined' || typeof window.turnstile === 'undefined') {
        throw new Error('Turnstile is not available');
      }
      
      // 添加超时保护
      const renderPromise = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Turnstile render timeout'));
        }, this.renderTimeout); // 使用配置的超时时间
        
        try {
          const widgetId = window.turnstile.render(element, {
            ...defaultOptions,
            'error-callback': () => {
              clearTimeout(timeout);
              console.warn('Turnstile error callback triggered');
              if (defaultOptions['error-callback']) {
                defaultOptions['error-callback']();
              }
              // 不要立即拒绝，可能只是暂时的错误
            },
            callback: (token: string) => {
              clearTimeout(timeout);
              defaultOptions.callback(token);
              resolve(widgetId);
            }
          });
          
          // 如果立即返回了 widgetId，清除超时并解析
          if (widgetId) {
            clearTimeout(timeout);
            resolve(widgetId);
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
      
      const widgetId = await renderPromise;
      
      // 保存 widgetId 和 element 的关联关系
      const elementId = typeof element === 'string' ? element : element.id;
      if (elementId) {
        this.widgets.set(widgetId, elementId);
      }
      
      return widgetId;
    } catch (error) {
      console.error('Turnstile render failed:', error);
      throw error;
    }
  }

  /**
   * 重置指定的 widget
   */
  reset(widgetId?: string): void {
    if (typeof window !== 'undefined' && typeof window.turnstile !== 'undefined') {
      try {
        window.turnstile.reset(widgetId);
      } catch (error) {
        console.warn('Failed to reset Turnstile widget:', error);
      }
    }
  }

  /**
   * 移除指定的 widget
   */
  remove(widgetId?: string): void {
    if (typeof window !== 'undefined' && typeof window.turnstile !== 'undefined') {
      try {
        window.turnstile.remove(widgetId);
        
        // 从 widgets 映射中移除
        if (widgetId) {
          this.widgets.delete(widgetId);
        }
      } catch (error) {
        console.warn('Failed to remove Turnstile widget:', error);
      }
    }
  }

  /**
   * 移除所有 widgets
   */
  removeAll(): void {
    if (typeof window !== 'undefined' && typeof window.turnstile !== 'undefined') {
      this.widgets.forEach((_, widgetId) => {
        try {
          window.turnstile.remove(widgetId);
        } catch (error) {
          console.warn('Failed to remove Turnstile widget:', error);
        }
      });
      this.widgets.clear();
    }
  }
  
  /**
   * 设置渲染超时时间（毫秒）
   */
  setRenderTimeout(timeout: number): void {
    this.renderTimeout = timeout;
  }
}

// 创建全局实例
const turnstileManager = TurnstileManager.getInstance();

// 扩展 window 对象类型定义
declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: TurnstileWidgetOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export default turnstileManager;