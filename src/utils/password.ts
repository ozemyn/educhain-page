import { PasswordValidationResult } from '@/types/user';

/**
 * 密码验证工具类 - 与后端保持一致的验证规则
 */
export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  /**
   * 验证密码强度
   * @param password 密码
   * @returns 验证结果
   */
  static validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    // 长度检查
    if (password.length < this.MIN_LENGTH) {
      errors.push(`密码长度至少需要${this.MIN_LENGTH}个字符`);
    }
    if (password.length > this.MAX_LENGTH) {
      errors.push(`密码长度不能超过${this.MAX_LENGTH}个字符`);
    }

    // 字符类型检查
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let characterTypeCount = 0;
    if (hasUppercase) characterTypeCount++;
    if (hasLowercase) characterTypeCount++;
    if (hasNumbers) characterTypeCount++;
    if (hasSpecialChars) characterTypeCount++;

    if (characterTypeCount < 3) {
      errors.push('密码必须包含至少3种字符类型（大写字母、小写字母、数字、特殊字符）');
    }

    // 常见弱密码检查
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'root', '12345678', 'welcome'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('不能使用常见的弱密码');
    }

    // 重复字符检查
    if (/(.)\1{2,}/.test(password)) {
      errors.push('密码不能包含连续3个或以上相同字符');
    }

    // 连续字符检查
    if (this.hasSequentialChars(password)) {
      errors.push('密码不能包含连续的字符序列（如123、abc）');
    }

    // 计算密码强度
    if (errors.length === 0) {
      if (password.length >= 12 && characterTypeCount >= 4) {
        strength = 'strong';
      } else if (password.length >= 10 && characterTypeCount >= 3) {
        strength = 'medium';
      } else {
        strength = 'weak';
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }

  /**
   * 检查是否包含连续字符
   * @param password 密码
   * @returns 是否包含连续字符
   */
  private static hasSequentialChars(password: string): boolean {
    const sequences = [
      '0123456789',
      'abcdefghijklmnopqrstuvwxyz',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm'
    ];

    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const subseq = sequence.substring(i, i + 3);
        if (password.toLowerCase().includes(subseq)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 获取密码强度颜色
   * @param strength 强度等级
   * @returns CSS颜色类名
   */
  static getStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
    switch (strength) {
      case 'weak':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'strong':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }

  /**
   * 获取密码强度文本
   * @param strength 强度等级
   * @returns 强度描述
   */
  static getStrengthText(strength: 'weak' | 'medium' | 'strong'): string {
    switch (strength) {
      case 'weak':
        return '弱';
      case 'medium':
        return '中等';
      case 'strong':
        return '强';
      default:
        return '未知';
    }
  }
}