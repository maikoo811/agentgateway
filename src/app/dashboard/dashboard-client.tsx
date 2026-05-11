'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface Stats {
  totalRequests: number
  totalTokens: number
  totalCost: number
  recentRequests: Array<{
    id: string
    provider: string
    model: string
    statusCode: number
    responseTime: number
    tokensUsed: number | null
    cost: number | null
    createdAt: Date
    apiKey: { name: string } | null
  }>
  usageStats: Array<{
    id: string
    date: Date
    provider: string
    model: string
    requestCount: number
    tokensUsed: number
    cost: number
    avgResponseTime: number
  }>
}

interface DashboardClientProps {
  stats: Stats
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DashboardClient({ stats }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // データの準備
  const dailyUsage = stats.usageStats.reduce((acc, stat) => {
    const date = new Date(stat.date).toLocaleDateString('ja-JP')
    if (!acc[date]) {
      acc[date] = { date, requests: 0, tokens: 0, cost: 0 }
    }
    acc[date].requests += stat.requestCount
    acc[date].tokens += stat.tokensUsed
    acc[date].cost += stat.cost
    return acc
  }, {} as Record<string, any>)

  const dailyUsageArray = Object.values(dailyUsage).slice(-7)

  const providerStats = stats.usageStats.reduce((acc, stat) => {
    if (!acc[stat.provider]) {
      acc[stat.provider] = { name: stat.provider, requests: 0, tokens: 0, cost: 0 }
    }
    acc[stat.provider].requests += stat.requestCount
    acc[stat.provider].tokens += stat.tokensUsed
    acc[stat.provider].cost += stat.cost
    return acc
  }, {} as Record<string, any>)

  const providerStatsArray = Object.values(providerStats)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">LLM API Gateway</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: '概要' },
              { id: 'requests', name: 'リクエスト' },
              { id: 'api-keys', name: 'APIキー' },
              { id: 'analytics', name: '分析' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">R</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">総リクエスト数</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalRequests.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">T</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">総トークン数</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalTokens.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">¥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">総コスト</dt>
                        <dd className="text-lg font-medium text-gray-900">${stats.totalCost.toFixed(2)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">日別使用量</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyUsageArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">プロバイダー別使用量</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={providerStatsArray}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="requests"
                    >
                      {providerStatsArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">最近のリクエスト</h3>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          プロバイダー
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          モデル
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          レスポンス時間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日時
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.model}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.statusCode >= 200 && request.statusCode < 300
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.statusCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.responseTime}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleString('ja-JP')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">リクエスト履歴</h3>
              <p className="mt-1 text-sm text-gray-500">すべてのAPIリクエストの詳細履歴</p>
              {/* リクエスト履歴の詳細実装は後で追加 */}
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">APIキー管理</h3>
              <p className="mt-1 text-sm text-gray-500">APIキーの作成、編集、削除</p>
              {/* APIキー管理の詳細実装は後で追加 */}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">詳細分析</h3>
              <p className="mt-1 text-sm text-gray-500">使用量の詳細分析とレポート</p>
              {/* 詳細分析の実装は後で追加 */}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


