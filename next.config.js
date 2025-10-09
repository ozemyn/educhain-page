/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持Cloudflare Pages部署（明确指定输出目录）
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // 禁用预渲染，使用客户端渲染
  experimental: {
    optimizeCss: false, // 禁用CSS优化避免critters错误
  },

  // 环境变量配置 - 包含所有默认值避免构建警告
  env: {
    // API服务地址
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.educhain.cc',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.educhain.cc',

    // Cloudflare Turnstile 人机验证配置
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAB5OEAE6uRmM1pwK',

    // Socket.io 实时通信配置
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://api.educhain.cc',

    // 应用基础配置
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '知识分享社区',
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '基于可信区块链记录的知识贡献激励系统',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // 文件上传配置
    NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760',
    NEXT_PUBLIC_ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,txt,md',

    // 主题配置
    NEXT_PUBLIC_DEFAULT_THEME: process.env.NEXT_PUBLIC_DEFAULT_THEME || 'light',
    NEXT_PUBLIC_THEME_STORAGE_KEY: process.env.NEXT_PUBLIC_THEME_STORAGE_KEY || 'knowledge-community-theme',

    // 分页配置
    NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20',
    NEXT_PUBLIC_MAX_PAGE_SIZE: process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || '100',
  },

  // 移除rewrites，静态导出不支持

  // 构建优化已移至上方

  // 压缩配置
  compress: true,

  // 生产环境配置
  poweredByHeader: false,
  generateEtags: false,

  // 添加安全头部，支持 Turnstile
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
              "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.educhain.cc https://challenges.cloudflare.com",
              "frame-src 'self' https://challenges.cloudflare.com https://www.google.com/recaptcha/",
              "worker-src 'self' blob:",
              "child-src 'self' https://challenges.cloudflare.com"
            ].join('; ')
          }
        ]
      }
    ]
  },
};

module.exports = nextConfig;