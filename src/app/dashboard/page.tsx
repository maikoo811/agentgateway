'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  LayoutDashboard,
  Key,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react'

interface Stats {
  totalRequests: number
  totalCost: number
  avgLatency: number
  successRate: number
  changes: {
    requests: number
    cost: number
    latency: number
    successRate: number
  }
}

interface UsageData {
  date: string
  requests: number
}

interface Request {
  id: string
  time: string
  model: string
  tokens: string
  cost: string
  status: 'success' | 'error'
}

interface ModelData {
  name: string
  value: number
  count: number
  color: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [modelData, setModelData] = useState<ModelData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/dashboard')
      return
    }
    fetchDashboardData()
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [statsRes, usageRes, requestsRes, modelsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/usage'),
        fetch('/api/dashboard/requests'),
        fetch('/api/dashboard/models'),
      ])

      if ([statsRes, usageRes, requestsRes, modelsRes].some((res) => res.status === 401)) {
        router.replace('/auth/signin?callbackUrl=/dashboard')
        return
      }

      const [statsData, usageData, requestsData, modelsData] = await Promise.all([
        statsRes.json(),
        usageRes.json(),
        requestsRes.json(),
        modelsRes.json(),
      ])

      setStats(statsData)
      setUsageData(usageData)
      setRequests(requestsData.requests)
      setModelData(modelsData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-violet-400">AgentGateway</h1>
        </div>
        <nav className="space-y-2">
          <div className="flex items-center gap-3 px-4 py-2 bg-violet-600 rounded-lg">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <Key size={20} />
            <span>API Keys</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <FileText size={20} />
            <span>Requests</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Requests</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {stats?.totalRequests.toLocaleString() || '0'}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                (stats?.changes.requests || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {(stats?.changes.requests || 0) >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(stats?.changes.requests || 0).toFixed(1)}%</span>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Cost</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                ${stats?.totalCost.toFixed(2) || '0.00'}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                (stats?.changes.cost || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {(stats?.changes.cost || 0) >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(stats?.changes.cost || 0).toFixed(1)}%</span>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Avg Latency</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {stats?.avgLatency.toFixed(1) || '0.0'}ms
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                (stats?.changes.latency || 0) <= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {(stats?.changes.latency || 0) <= 0 ? (
                  <TrendingDown size={16} />
                ) : (
                  <TrendingUp size={16} />
                )}
                <span>{Math.abs(stats?.changes.latency || 0).toFixed(1)}%</span>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {stats?.successRate.toFixed(2) || '0.00'}%
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                (stats?.changes.successRate || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {(stats?.changes.successRate || 0) >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(stats?.changes.successRate || 0).toFixed(1)}%</span>
              </div>
            </Card>
          </div>

          {/* Volume Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Request Volume (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fill="url(#colorRequests)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Requests */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-slate-600 w-20">{req.time}</span>
                      <span className="text-slate-900 font-medium">{req.model}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">{req.tokens}</span>
                      <span className="text-slate-900 font-medium">{req.cost}</span>
                      <Badge variant={req.status === 'success' ? 'default' : 'destructive'}>
                        {req.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Model Usage */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Model Usage</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={modelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}