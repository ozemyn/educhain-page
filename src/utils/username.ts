/**
 * 用户名验证工具类 - 与后端保持一致的验证规则
 */
export class UsernameValidator {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 20;
  private static readonly RESERVED_WORDS = ['admin', 'root', 'system', 'api', 'www', 'mail'];

  /**
   * 验证用户名格式
   * @param username 用户名
   * @returns 验证结果
   */
  static validateUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 长度检查
    if (username.length < this.MIN_LENGTH) {
      errors.push(`用户名长度至少需要${this.MIN_LENGTH}个字符`);
    }
    if (username.length > this.MAX_LENGTH) {
      errors.push(`用户名长度不能超过${this.MAX_LENGTH}个字符`);
    }

    // 字符检查
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('用户名只能包含字母、数字、下划线和连字符');
    }

    // 开头检查
    if (/^[0-9]/.test(username)) {
      errors.push('用户名不能以数字开头');
    }

    // 保留词检查
    if (this.RESERVED_WORDS.includes(username.toLowerCase())) {
      errors.push('该用户名为系统保留词，请选择其他用户名');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证邮箱格式
   * @param email 邮箱地址
   * @returns 是否有效
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}