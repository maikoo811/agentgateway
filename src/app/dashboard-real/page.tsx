'use client';

import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';

// サンプルデータ（実際のAPIから取得するように後で修正）
const volumeData = [
  { date: 'Dec 5', requests: 1200 },
  { date: 'Dec 6', requests: 1900 },
  { date: 'Dec 7', requests: 3000 },
  { date: 'Dec 8', requests: 5000 },
  { date: 'Dec 9', requests: 4500 },
  { date: 'Dec 10', requests: 6000 },
  { date: 'Dec 11', requests: 8000 },
];

const modelData = [
  { name: 'GPT-4o', value: 45, color: '#8B5CF6' },
  { name: 'Claude-3.5-Sonnet', value: 30, color: '#3B82F6' },
  { name: 'GPT-4o-Mini', value: 15, color: '#10B981' },
  { name: 'Claude-3.5-Haiku', value: 10, color: '#F59E0B' },
];

const recentRequests = [
  { time: '12:34:56', model: 'gpt-4o', tokens: '1,234', cost: '$0.0234', status: 'success' },
  { time: '12:33:45', model: 'claude-3.5-sonnet', tokens: '2,456', cost: '$0.0456', status: 'success' },
  { time: '12:32:12', model: 'gpt-4o-mini', tokens: '567', cost: '$0.0012', status: 'success' },
  { time: '12:31:09', model: 'gpt-4o', tokens: '3,456', cost: '$0.0567', status: 'error' },
  { time: '12:30:23', model: 'claude-3.5-haiku', tokens: '890', cost: '$0.0089', status: 'success' },
];

export default function DashboardRealPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">December 11, 2024</p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Volume Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Request Volume (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
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
              {recentRequests.map((req, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
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
    </div>
  );
}


