'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                隐私政策
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                最后更新时间: 2024年1月1日
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  1. 信息收集
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们收集您在使用EduChain平台时主动提供的信息，包括但不限于：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>注册账户时提供的邮箱、用户名等基本信息</li>
                  <li>发布内容时提供的标题、正文、标签等</li>
                  <li>参与互动时的点赞、评论、收藏等行为数据</li>
                  <li>使用平台功能时的设备信息、IP地址等技术信息</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  2. 区块链记录
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们使用区块链技术记录用户的贡献行为，包括：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>内容发布记录</li>
                  <li>代币获得和消费记录</li>
                  <li>社区互动贡献记录</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400">
                  这些记录具有不可篡改和公开可查的特点，您在使用平台时应理解并接受这一特性。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  3. 信息使用
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们收集的信息用于以下目的：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>提供、维护和改进平台服务</li>
                  <li>个性化用户体验和内容推荐</li>
                  <li>处理用户请求和提供客户支持</li>
                  <li>安全监控和防止欺诈行为</li>
                  <li>分析平台使用情况和用户行为</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  4. 信息披露
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们不会将您的个人信息出售给第三方。但在以下情况下，我们可能会披露您的信息：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>获得您的明确同意</li>
                  <li>根据法律法规要求</li>
                  <li>为保护平台、用户或公众的合法权益</li>
                  <li>在涉及公司重组、合并或出售时</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  5. 数据安全
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们采取合理的技术和组织措施保护您的个人信息安全，包括：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>使用加密技术保护数据传输</li>
                  <li>实施访问控制和身份验证</li>
                  <li>定期进行安全评估和漏洞修复</li>
                  <li>限制员工对个人信息的访问权限</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  6. Cookie和追踪技术
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们使用Cookie和类似追踪技术来改善用户体验，包括记住您的偏好设置、分析网站流量等。
                  您可以通过浏览器设置管理Cookie的使用。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  7. 第三方服务
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们可能使用第三方服务来提供某些功能，这些服务可能有独立的隐私政策。
                  我们建议您在使用这些服务时查看其隐私条款。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  8. 用户权利
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  根据相关法律法规，您享有以下权利：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                  <li>访问、更正或删除您的个人信息</li>
                  <li>限制或反对处理您的个人信息</li>
                  <li>数据可携带权</li>
                  <li>撤回同意的权利</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  9. 儿童隐私
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们的平台不面向未满18周岁的用户。我们不会故意收集儿童的个人信息。
                  如果发现误收集了儿童信息，我们将立即删除。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  10. 政策变更
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们可能不时更新本隐私政策。重大变更将通过平台公告等方式通知用户。
                  建议您定期查看本政策以了解最新内容。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  11. 联系我们
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>邮箱: privacy@educhain.cc</li>
                  <li>客服: 在线客服系统</li>
                  <li>邮寄地址: [公司地址]</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link 
                href="/" 
                className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 inline-flex items-center"
              >
                返回首页
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}