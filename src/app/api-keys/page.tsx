'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  Loader2
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  description: string
  keyPrefix: string
  isActive: boolean
  lastUsed: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyDescription, setNewKeyDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/api-keys')
      return
    }
    fetchApiKeys()
  }, [status, router])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/api-keys')
      if (response.status === 401) {
        router.replace('/auth/signin?callbackUrl=/api-keys')
        return
      }
      const data = await response.json()
      setApiKeys(data.apiKeys)
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) return

    try {
      setCreating(true)
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName,
          description: newKeyDescription,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setApiKeys([data, ...apiKeys])
        setNewKeyName('')
        setNewKeyDescription('')
        setShowCreateForm(false)
        // 新しいキーをコピー
        if (data.key) {
          navigator.clipboard.writeText(data.key)
          setCopiedKey(data.id)
          setTimeout(() => setCopiedKey(null), 2000)
        }
      }
    } catch (error) {
      console.error('Failed to create API key:', error)
    } finally {
      setCreating(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  const toggleApiKey = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      })

      if (response.ok) {
        setApiKeys(apiKeys.map(key => 
          key.id === id ? { ...key, isActive: !isActive } : key
        ))
      }
    } catch (error) {
      console.error('Failed to toggle API key:', error)
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
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-violet-600 rounded-lg">
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
                    onClick={createApiKey}
                    disabled={!newKeyName.trim() || creating}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
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
            {apiKeys.length === 0 ? (
              <Card className="p-8 text-center">
                <Key className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No API Keys</h3>
                <p className="text-slate-600 mb-4">Create your first API key to start using the AgentGateway API</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </Card>
            ) : (
              apiKeys.map((apiKey) => (
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
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Key: {apiKey.keyPrefix}...</span>
                        <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                        {apiKey.lastUsed && (
                          <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => toggleApiKey(apiKey.id, apiKey.isActive)}
                        variant="outline"
                        size="sm"
                      >
                        {apiKey.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        onClick={() => deleteApiKey(apiKey.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
