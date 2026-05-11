'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Key,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react'
import { useState } from 'react'

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
]

export function ApiKeysMockup() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyDescription, setNewKeyDescription] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-violet-400">AgentGateway</h1>
        </div>
        <nav className="space-y-2">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
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
          <div className="flex items-center gap-3 px-4 py-2 bg-violet-600 rounded-lg">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
                      setNewKeyName('')
                      setNewKeyDescription('')
                      setShowCreateForm(false)
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
        </div>
      </main>
    </div>
  )
}


