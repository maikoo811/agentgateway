'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  LayoutDashboard,
  Key,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

const volumeData = [
  { date: 'Mon', requests: 12000 },
  { date: 'Tue', requests: 15000 },
  { date: 'Wed', requests: 18000 },
  { date: 'Thu', requests: 16000 },
  { date: 'Fri', requests: 22000 },
  { date: 'Sat', requests: 19000 },
  { date: 'Sun', requests: 24000 },
];

const modelData = [
  { name: 'gpt-4o', value: 45, color: '#8B5CF6' },
  { name: 'claude-3.5-sonnet', value: 30, color: '#3B82F6' },
  { name: 'gpt-4o-mini', value: 15, color: '#10B981' },
  { name: 'claude-3.5-haiku', value: 10, color: '#F59E0B' },
];

const recentRequests = [
  { time: '12:34:56', model: 'gpt-4o', tokens: '1,234', cost: '$0.0234', status: 'success' },
  { time: '12:33:45', model: 'claude-3.5-sonnet', tokens: '2,456', cost: '$0.0456', status: 'success' },
  { time: '12:32:12', model: 'gpt-4o-mini', tokens: '567', cost: '$0.0012', status: 'success' },
  { time: '12:31:09', model: 'gpt-4o', tokens: '3,456', cost: '$0.0567', status: 'error' },
  { time: '12:30:23', model: 'claude-3.5-haiku', tokens: '890', cost: '$0.0089', status: 'success' },
];

const mockApiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    description: 'Main API key for production environment',
    keyPrefix: 'ag_7f8a9b2c',
    isActive: true,
    lastUsed: '2024-12-11T10:30:00Z',
    createdAt: '2024-12-01T09:00:00Z',
  },
  {
    id: '2',
    name: 'Development API Key',
    description: 'API key for development and testing',
    keyPrefix: 'ag_3e4f5g6h',
    isActive: true,
    lastUsed: '2024-12-10T15:45:00Z',
    createdAt: '2024-11-15T14:20:00Z',
  },
  {
    id: '3',
    name: 'Staging API Key',
    description: 'API key for staging environment',
    keyPrefix: 'ag_1a2b3c4d',
    isActive: false,
    lastUsed: '2024-12-05T08:15:00Z',
    createdAt: '2024-11-01T11:30:00Z',
  },
];

const mockRequests = [
  {
    id: '1',
    timestamp: '2024-12-11T12:34:56Z',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    model: 'gpt-4o',
    status: 200,
    responseTime: 1250,
    tokens: 1234,
    cost: 0.0234,
    userAgent: 'AgentGateway-SDK/1.0.0',
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    timestamp: '2024-12-11T12:33:45Z',
    method: 'POST',
    endpoint: '/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
    status: 200,
    responseTime: 890,
    tokens: 2456,
    cost: 0.0456,
    userAgent: 'AgentGateway-SDK/1.0.0',
    ipAddress: '192.168.1.100',
  },
  {
    id: '3',
    timestamp: '2024-12-11T12:32:12Z',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    model: 'gpt-4o-mini',
    status: 200,
    responseTime: 567,
    tokens: 567,
    cost: 0.0012,
    userAgent: 'AgentGateway-SDK/1.0.0',
    ipAddress: '192.168.1.100',
  },
  {
    id: '4',
    timestamp: '2024-12-11T12:31:09Z',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    model: 'gpt-4o',
    status: 429,
    responseTime: 120,
    tokens: 0,
    cost: 0,
    userAgent: 'AgentGateway-SDK/1.0.0',
    ipAddress: '192.168.1.100',
  },
  {
    id: '5',
    timestamp: '2024-12-11T12:30:23Z',
    method: 'POST',
    endpoint: '/v1/messages',
    model: 'claude-3-5-haiku-20241022',
    status: 200,
    responseTime: 445,
    tokens: 890,
    cost: 0.0089,
    userAgent: 'AgentGateway-SDK/1.0.0',
    ipAddress: '192.168.1.100',
  },
  {
    id: '6',
    timestamp: '2024-12-11T12:29:15Z',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    model: 'gpt-4o',
    status: 200,
    responseTime: 1100,
    tokens: 1789,
    cost: 0.0345,
    userAgent: 'AgentGateway-SDK/1.0.0',
    ipAddress: '192.168.1.100',
  },
];

const analyticsData = {
  hourly: [
    { hour: '00:00', requests: 45, cost: 0.89 },
    { hour: '01:00', requests: 32, cost: 0.67 },
    { hour: '02:00', requests: 28, cost: 0.54 },
    { hour: '03:00', requests: 35, cost: 0.71 },
    { hour: '04:00', requests: 42, cost: 0.83 },
    { hour: '05:00', requests: 58, cost: 1.12 },
    { hour: '06:00', requests: 78, cost: 1.45 },
    { hour: '07:00', requests: 95, cost: 1.78 },
    { hour: '08:00', requests: 120, cost: 2.34 },
    { hour: '09:00', requests: 145, cost: 2.89 },
    { hour: '10:00', requests: 167, cost: 3.45 },
    { hour: '11:00', requests: 189, cost: 3.78 },
    { hour: '12:00', requests: 203, cost: 4.12 },
    { hour: '13:00', requests: 187, cost: 3.67 },
    { hour: '14:00', requests: 165, cost: 3.23 },
    { hour: '15:00', requests: 178, cost: 3.56 },
    { hour: '16:00', requests: 192, cost: 3.89 },
    { hour: '17:00', requests: 156, cost: 3.12 },
    { hour: '18:00', requests: 134, cost: 2.67 },
    { hour: '19:00', requests: 98, cost: 1.89 },
    { hour: '20:00', requests: 76, cost: 1.45 },
    { hour: '21:00', requests: 65, cost: 1.23 },
    { hour: '22:00', requests: 52, cost: 0.98 },
    { hour: '23:00', requests: 38, cost: 0.76 },
  ],
  modelUsage: [
    { model: 'gpt-4o', requests: 1250, cost: 24.50, avgLatency: 1200 },
    { model: 'claude-3-5-sonnet', requests: 890, cost: 18.90, avgLatency: 950 },
    { model: 'gpt-4o-mini', requests: 2100, cost: 8.40, avgLatency: 600 },
    { model: 'claude-3-5-haiku', requests: 450, cost: 4.50, avgLatency: 400 },
  ],
  errorRates: [
    { status: '200', count: 3450, percentage: 94.2 },
    { status: '429', count: 180, percentage: 4.9 },
    { status: '500', count: 30, percentage: 0.8 },
    { status: '401', count: 5, percentage: 0.1 },
  ],
};

export function DashboardMockup() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDescription, setNewKeyDescription] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-violet-400">AgentGateway</h1>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeView === 'dashboard'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('api-keys')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeView === 'api-keys'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key size={20} />
            <span>API Keys</span>
          </button>
          <button
            onClick={() => setActiveView('requests')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeView === 'requests'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText size={20} />
            <span>Requests</span>
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeView === 'analytics'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeView === 'settings'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {activeView === 'dashboard' && (
            <>
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">December 11, 2025</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Requests</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">127,543</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp size={16} />
                <span>+12.5%</span>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Total Cost</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">$234.67</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp size={16} />
                <span>+8.3%</span>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Avg Latency</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">2.3ms</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <TrendingDown size={16} />
                <span>-15.2%</span>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-slate-600 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-slate-900 mb-2">99.87%</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp size={16} />
                <span>+0.2%</span>
              </div>
              </Card>
              </div>

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
            </>
          )}

          {activeView === 'api-keys' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
                  <p className="text-slate-600">Manage your API keys for accessing the AgentGateway API</p>
                </div>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </div>

              {/* Create Form */}
              {showCreateForm && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="e.g., Production API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newKeyDescription}
                        onChange={(e) => setNewKeyDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Optional description for this API key"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setNewKeyName('');
                          setNewKeyDescription('');
                          setShowCreateForm(false);
                        }}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Key
                      </Button>
                      <Button
                        onClick={() => setShowCreateForm(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* API Keys List */}
              <div className="space-y-4">
                {mockApiKeys.map((apiKey) => (
                  <Card key={apiKey.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{apiKey.name}</h3>
                          <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                            {apiKey.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {apiKey.description && (
                          <p className="text-slate-600 mb-2">{apiKey.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <span>Key: {apiKey.keyPrefix}...</span>
                          <span>Created: {formatDate(apiKey.createdAt)}</span>
                          {apiKey.lastUsed && (
                            <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                          )}
                        </div>
                        
                        {/* API Key Display */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-3 py-2 bg-slate-100 rounded-lg font-mono text-sm">
                            {visibleKeys.has(apiKey.id) 
                              ? `${apiKey.keyPrefix}_${'x'.repeat(32)}`
                              : `${apiKey.keyPrefix}_${'•'.repeat(32)}`
                            }
                          </div>
                          <Button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            variant="outline"
                            size="sm"
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(`${apiKey.keyPrefix}_${'x'.repeat(32)}`, apiKey.id)}
                            variant="outline"
                            size="sm"
                          >
                            {copiedKey === apiKey.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          {apiKey.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Usage Stats */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">API Key Usage</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">3</div>
                    <div className="text-sm text-slate-600">Total Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">2</div>
                    <div className="text-sm text-slate-600">Active Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">1,247</div>
                    <div className="text-sm text-slate-600">Requests Today</div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeView === 'requests' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Request Logs</h1>
                  <p className="text-slate-600">View and analyze all API requests made through AgentGateway</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    Export CSV
                  </Button>
                  <Button variant="outline">
                    Filter
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Total Requests</div>
                  <div className="text-2xl font-bold text-slate-900">4,690</div>
                  <div className="text-xs text-slate-500">Last 24 hours</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Success Rate</div>
                  <div className="text-2xl font-bold text-slate-900">94.2%</div>
                  <div className="text-xs text-slate-500">+2.1% from yesterday</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold text-slate-900">856ms</div>
                  <div className="text-xs text-slate-500">-12% from yesterday</div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Total Cost</div>
                  <div className="text-2xl font-bold text-slate-900">$56.30</div>
                  <div className="text-xs text-slate-500">Last 24 hours</div>
                </Card>
              </div>

              {/* Requests Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Requests</h2>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option>All Models</option>
                      <option>GPT-4o</option>
                      <option>Claude-3.5-Sonnet</option>
                      <option>GPT-4o-Mini</option>
                    </select>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option>All Status</option>
                      <option>Success (200)</option>
                      <option>Rate Limited (429)</option>
                      <option>Error (500)</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Method</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Endpoint</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Model</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Response Time</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Tokens</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRequests.map((request) => (
                        <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {new Date(request.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {request.method}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 font-mono">
                            {request.endpoint}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-900">
                            {request.model}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <Badge 
                              variant={request.status === 200 ? 'default' : 'destructive'}
                            >
                              {request.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {request.responseTime}ms
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {request.tokens.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            ${request.cost.toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Showing 6 of 4,690 requests
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeView === 'analytics' && (
            <>
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-600">Detailed insights into your API usage patterns and performance</p>
              </div>

              {/* Time Range Selector */}
              <div className="flex gap-4">
                <Button variant="outline">Last 24 hours</Button>
                <Button variant="outline">Last 7 days</Button>
                <Button className="bg-violet-600 hover:bg-violet-700">Last 30 days</Button>
                <Button variant="outline">Custom range</Button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Total Requests</div>
                  <div className="text-3xl font-bold text-slate-900">127,543</div>
                  <div className="flex items-center gap-1 text-sm text-emerald-600 mt-2">
                    <TrendingUp size={16} />
                    <span>+12.5%</span>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Total Cost</div>
                  <div className="text-3xl font-bold text-slate-900">$2,456.78</div>
                  <div className="flex items-center gap-1 text-sm text-emerald-600 mt-2">
                    <TrendingUp size={16} />
                    <span>+8.3%</span>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Avg Latency</div>
                  <div className="text-3xl font-bold text-slate-900">856ms</div>
                  <div className="flex items-center gap-1 text-sm text-emerald-600 mt-2">
                    <TrendingDown size={16} />
                    <span>-15.2%</span>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Success Rate</div>
                  <div className="text-3xl font-bold text-slate-900">94.2%</div>
                  <div className="flex items-center gap-1 text-sm text-emerald-600 mt-2">
                    <TrendingUp size={16} />
                    <span>+0.2%</span>
                  </div>
                </Card>
              </div>

              {/* Hourly Usage Chart */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Hourly Usage (Last 24 Hours)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.hourly}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
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

              {/* Model Performance & Error Rates */}
              <div className="grid grid-cols-2 gap-6">
                {/* Model Performance */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Model Performance</h2>
                  <div className="space-y-4">
                    {analyticsData.modelUsage.map((model, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900">{model.model}</div>
                          <div className="text-sm text-slate-600">{model.requests.toLocaleString()} requests</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slate-900">${model.cost.toFixed(2)}</div>
                          <div className="text-sm text-slate-600">{model.avgLatency}ms avg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Error Rates */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Error Distribution</h2>
                  <div className="space-y-4">
                    {analyticsData.errorRates.map((error, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            error.status === '200' ? 'bg-emerald-500' :
                            error.status === '429' ? 'bg-amber-500' :
                            error.status === '500' ? 'bg-red-500' : 'bg-slate-500'
                          }`} />
                          <span className="font-medium text-slate-900">{error.status}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-slate-900">{error.count}</div>
                          <div className="text-sm text-slate-600">{error.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Cost Analysis */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cost Analysis</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">$2,456.78</div>
                    <div className="text-sm text-slate-600">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">$0.019</div>
                    <div className="text-sm text-slate-600">Avg Cost per Request</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">$81.89</div>
                    <div className="text-sm text-slate-600">Daily Average</div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeView === 'settings' && (
            <>
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-600">Manage your account preferences and profile information</p>
              </div>

              {/* Profile Section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      defaultValue="Acme Corp"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                      <option>Developer</option>
                      <option>Admin</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-violet-600 hover:bg-violet-700">
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Security Section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      Update Password
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Preferences Section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Email Notifications</h3>
                      <p className="text-sm text-slate-600">Receive email updates about your usage and billing</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-violet-600 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">API Rate Limit Alerts</h3>
                      <p className="text-sm text-slate-600">Get notified when approaching rate limits</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-violet-600 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Usage Reports</h3>
                      <p className="text-sm text-slate-600">Weekly usage and cost reports</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-violet-600 rounded" />
                  </div>
                </div>
              </Card>

              {/* Billing Section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Billing</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">Current Plan</h3>
                    <p className="text-sm text-slate-600">Pro Plan - $99/month</p>
                  </div>
                  <Button variant="outline">
                    Change Plan
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Payment Method</h3>
                      <p className="text-sm text-slate-600">•••• •••• •••• 4242</p>
                    </div>
                    <Button variant="outline">
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
