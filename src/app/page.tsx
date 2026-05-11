'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('typescript')

  const codeExamples = {
    typescript: `import { AgentGateway } from '@agentgateway/sdk';

const agent = new AgentGateway({
  apiKey: process.env.AGENTGATEWAY_KEY,
  analytics: true // 自動トレーシング有効
});

const result = await agent.run({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Analyze this data...' }],
  tools: [searchTool, analysisTool]
});

console.log(result.analytics); // 詳細な分析データ`,
    python: `from agentgateway import AgentGateway

agent = AgentGateway(
    api_key=os.getenv('AGENTGATEWAY_KEY'),
    analytics=True  # 自動トレーシング有効
)

result = agent.run(
    model='gpt-4o',
    messages=[{'role': 'user', 'content': 'Analyze this data...'}],
    tools=[search_tool, analysis_tool]
)

print(result.analytics)  # 詳細な分析データ`,
    curl: `curl -X POST https://api.agentgateway.com/v1/run \\
  -H "Authorization: Bearer $AGENTGATEWAY_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Analyze this data..."}],
    "tools": ["search", "analysis"],
    "analytics": true
  }'`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-blue-600 to-violet-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              The Fast & Analytics-First
              <br />
              <span className="text-violet-300">
                LLM Gateway
              </span>
              <br />
              for AI Agent Builders
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-4xl mx-auto">
              LiteLLMの3倍高速。エージェント開発に特化した分析ダッシュボード。本番環境で使える信頼性。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="bg-white text-violet-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-50 transition-colors shadow-lg"
              >
                Start Free
              </Link>
              <Link
                href="/mockup"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-sm text-slate-400">developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50M+</div>
                <div className="text-sm text-slate-400">requests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-slate-400">uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 md:space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Developers Are Moving Away from LiteLLM
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-red-600">🐌</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">High Latency</h3>
              <p className="text-base md:text-lg text-slate-700">平均レスポンス時間が遅く、本番環境で不安定</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-amber-600">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Limited Analytics</h3>
              <p className="text-base md:text-lg text-slate-700">ビルトイン分析が弱く、外部ツール必須</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-slate-600">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No Agent Focus</h3>
              <p className="text-base md:text-lg text-slate-700">エージェント開発に特化した機能がない</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution/Features Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 md:space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Built for Modern AI Agent Development
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:border-violet-200 border border-transparent transition-all">
              <div className="text-4xl mb-4 text-violet-600">⚡</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">&lt;3ms Latency</h3>
              <p className="text-base md:text-lg text-slate-700">Rust製ゲートウェイで超低レイテンシー実現</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:border-violet-200 border border-transparent transition-all">
              <div className="text-4xl mb-4 text-violet-600">📈</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Agent Flow Visualization</h3>
              <p className="text-base md:text-lg text-slate-700">エージェントの思考プロセスを完全可視化</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:border-violet-200 border border-transparent transition-all">
              <div className="text-4xl mb-4 text-violet-600">💰</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-time Cost Tracking</h3>
              <p className="text-base md:text-lg text-slate-700">モデル・タスク別の詳細コスト分析</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:border-violet-200 border border-transparent transition-all">
              <div className="text-4xl mb-4 text-violet-600">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Prompt Versioning</h3>
              <p className="text-base md:text-lg text-slate-700">Git風のプロンプト管理とロールバック</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:border-violet-200 border border-transparent transition-all">
              <div className="text-4xl mb-4 text-violet-600">🔄</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Multi-Provider Support</h3>
              <p className="text-base md:text-lg text-slate-700">Currently supports OpenAI and Anthropic. Additional providers planned.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:border-violet-200 border border-transparent transition-all">
              <div className="text-4xl mb-4 text-violet-600">🧪</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">A/B Testing</h3>
              <p className="text-base md:text-lg text-slate-700">複数プロンプト戦略の並行テストと比較</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Code Demo Section */}
      <section className="py-20 md:py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 md:space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Get Started in 30 Seconds
            </h2>
            <p className="text-base md:text-lg text-slate-300">シンプルなSDKで、すぐに始められます</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center mt-8 md:mt-12">
            {/* Code Tabs */}
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-violet-500/20">
              <div className="flex border-b border-slate-700">
                {['typescript', 'python', 'curl'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
                </pre>
              </div>
            </div>
            
            {/* Features List */}
            <div className="space-y-8 md:space-y-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Install SDK</h3>
                  <p className="text-base md:text-lg text-slate-300">npm install @agentgateway/sdk</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Configure API Key</h3>
                  <p className="text-base md:text-lg text-slate-300">環境変数にAPIキーを設定</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Start Building</h3>
                  <p className="text-base md:text-lg text-slate-300">エージェントを構築し、分析ダッシュボードで監視</p>
                </div>
              </div>
              
              <div className="pt-6">
                <Link
                  href="/mockup"
                  className="inline-flex items-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Get Started Now
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-violet-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Build the Next Generation of AI Agents?
            </h2>
            <p className="text-base md:text-lg text-gray-200">
              今すぐ無料で始めて、エージェント開発の未来を体験してください
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-violet-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-50 transition-colors shadow-lg"
            >
              Start Building Free
            </Link>
            <Link
              href="/mockup"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 md:space-y-12">
            <h3 className="text-2xl font-bold text-white">AgentGateway</h3>
            <p className="text-sm text-slate-600">
              The Fast & Analytics-First LLM Gateway for AI Agent Builders
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/auth/signup" className="text-slate-400 hover:text-violet-400">
                Sign Up
              </Link>
              <Link href="/mockup" className="text-slate-400 hover:text-violet-400">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
