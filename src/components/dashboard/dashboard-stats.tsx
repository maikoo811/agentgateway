'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStats {
  totalRequests: number;
  totalCost: number;
  avgLatency: number;
  successRate: number;
  changes: {
    requests: number;
    cost: number;
    latency: number;
    successRate: number;
  };
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm text-slate-600 mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-slate-900">-</div>
          <div className="text-sm text-slate-500">No data</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600 mb-1">Total Cost</div>
          <div className="text-3xl font-bold text-slate-900">-</div>
          <div className="text-sm text-slate-500">No data</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600 mb-1">Avg Latency</div>
          <div className="text-3xl font-bold text-slate-900">-</div>
          <div className="text-sm text-slate-500">No data</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600 mb-1">Success Rate</div>
          <div className="text-3xl font-bold text-slate-900">-</div>
          <div className="text-sm text-slate-500">No data</div>
        </Card>
      </div>
    );
  }

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? 'text-emerald-600' : 'text-red-600';
    const icon = isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
    const sign = isPositive ? '+' : '';
    
    return (
      <div className={`flex items-center gap-1 text-sm ${color}`}>
        {icon}
        <span>{sign}{change.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="text-sm text-slate-600 mb-1">Total Requests</div>
        <div className="text-3xl font-bold text-slate-900 mb-2">
          {stats.totalRequests.toLocaleString()}
        </div>
        {formatChange(stats.changes.requests)}
      </Card>
      <Card className="p-6">
        <div className="text-sm text-slate-600 mb-1">Total Cost</div>
        <div className="text-3xl font-bold text-slate-900 mb-2">
          ${stats.totalCost.toFixed(2)}
        </div>
        {formatChange(stats.changes.cost)}
      </Card>
      <Card className="p-6">
        <div className="text-sm text-slate-600 mb-1">Avg Latency</div>
        <div className="text-3xl font-bold text-slate-900 mb-2">
          {Math.round(stats.avgLatency)}ms
        </div>
        {formatChange(stats.changes.latency)}
      </Card>
      <Card className="p-6">
        <div className="text-sm text-slate-600 mb-1">Success Rate</div>
        <div className="text-3xl font-bold text-slate-900 mb-2">
          {stats.successRate.toFixed(2)}%
        </div>
        {formatChange(stats.changes.successRate)}
      </Card>
    </div>
  );
}


