import { GlassCard } from '@/components/ui/GlassCard';

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          系统设置
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          配置系统参数和管理选项
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            基础设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                系统名称
              </label>
              <input
                type="text"
                className="glass-input w-full"
                defaultValue="EduChain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                系统描述
              </label>
              <textarea
                className="glass-input w-full h-20 resize-none"
                defaultValue="EduChain - 去中心化知识分享与激励平台"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                管理员邮箱
              </label>
              <input
                type="email"
                className="glass-input w-full"
                defaultValue="admin@example.com"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            区块链设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                出块间隔 (秒)
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="15"
                min="5"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最大交易数/区块
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="100"
                min="10"
                max="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                验证节点数量
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="3"
                min="1"
                max="10"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            代币设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                默认奖励代币数量
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="10"
                min="1"
                max="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                质量评分阈值
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="80"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoDistribute"
                className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="autoDistribute" className="text-sm text-gray-700 dark:text-gray-300">
                自动分发代币奖励
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            内容审核设置
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoReview"
                className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="autoReview" className="text-sm text-gray-700 dark:text-gray-300">
                启用自动内容审核
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="requireApproval"
                className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="requireApproval" className="text-sm text-gray-700 dark:text-gray-300">
                新内容需要审核批准
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                敏感词过滤级别
              </label>
              <select className="glass-select w-full">
                <option value="low">低</option>
                <option value="medium" selected>中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            安全设置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会话超时时间 (分钟)
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="30"
                min="5"
                max="480"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最大登录尝试次数
              </label>
              <input
                type="number"
                className="glass-input w-full"
                defaultValue="5"
                min="3"
                max="10"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableTwoFactor"
                className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enableTwoFactor" className="text-sm text-gray-700 dark:text-gray-300">
                启用双因素认证
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            系统维护
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">数据库备份</span>
              <button className="glass-button text-sm">
                立即备份
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">清理缓存</span>
              <button className="glass-button text-sm">
                清理缓存
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">系统日志</span>
              <button className="glass-button text-sm">
                查看日志
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">重启服务</span>
              <button className="glass-button text-sm bg-red-500/20 text-red-600 dark:text-red-400">
                重启系统
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="glass-button">
          重置设置
        </button>
        <button className="glass-button bg-blue-500/20 text-blue-600 dark:text-blue-400">
          保存设置
        </button>
      </div>
    </div>
  );
}