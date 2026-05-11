import { NextRequest, NextResponse } from 'next/server'
import { authenticateSession } from '@/lib/auth-helpers'
import { sanitizeError } from '@/lib/api-utils'
import { AuthenticationError } from '@/lib/errors'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // セッション認証（ダッシュボード用）
    const auth = await authenticateSession(req)
    const userId = auth.userId

    // 期間を取得（デフォルトは過去30日）
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 基本統計を取得
    const [
      totalRequests,
      totalCost,
      avgLatency,
      successRate,
      previousPeriodRequests,
      previousPeriodCost,
      previousPeriodLatency,
      previousPeriodSuccessRate,
    ] = await Promise.all([
      // 現在期間の統計
      prisma.request.count({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.request.aggregate({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _sum: { cost: true },
      }),
      prisma.request.aggregate({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _avg: { responseTime: true },
      }),
      prisma.request.groupBy({
        by: ['statusCode'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _count: { statusCode: true },
      }),
      // 前期間の統計（比較用）
      prisma.request.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(startDate.getTime() - (days * 24 * 60 * 60 * 1000)),
            lt: startDate,
          },
        },
      }),
      prisma.request.aggregate({
        where: {
          userId,
          createdAt: {
            gte: new Date(startDate.getTime() - (days * 24 * 60 * 60 * 1000)),
            lt: startDate,
          },
        },
        _sum: { cost: true },
      }),
      prisma.request.aggregate({
        where: {
          userId,
          createdAt: {
            gte: new Date(startDate.getTime() - (days * 24 * 60 * 60 * 1000)),
            lt: startDate,
          },
        },
        _avg: { responseTime: true },
      }),
      prisma.request.groupBy({
        by: ['statusCode'],
        where: {
          userId,
          createdAt: {
            gte: new Date(startDate.getTime() - (days * 24 * 60 * 60 * 1000)),
            lt: startDate,
          },
        },
        _count: { statusCode: true },
      }),
    ])

    // 成功率を計算
    const currentSuccessCount = successRate.find(s => s.statusCode >= 200 && s.statusCode < 300)?._count.statusCode || 0
    const currentTotalCount = successRate.reduce((sum, s) => sum + s._count.statusCode, 0)
    const currentSuccessRate = currentTotalCount > 0 ? (currentSuccessCount / currentTotalCount) * 100 : 0

    const previousSuccessCount = previousPeriodSuccessRate.find(s => s.statusCode >= 200 && s.statusCode < 300)?._count.statusCode || 0
    const previousTotalCount = previousPeriodSuccessRate.reduce((sum, s) => sum + s._count.statusCode, 0)
    const previousSuccessRate = previousTotalCount > 0 ? (previousSuccessCount / previousTotalCount) * 100 : 0

    // 変化率を計算
    const requestChange = previousPeriodRequests > 0 
      ? ((totalRequests - previousPeriodRequests) / previousPeriodRequests) * 100 
      : 0

    const costChange = previousPeriodCost._sum.cost && previousPeriodCost._sum.cost > 0
      ? ((totalCost._sum.cost! - previousPeriodCost._sum.cost) / previousPeriodCost._sum.cost) * 100
      : 0

    const latencyChange = previousPeriodLatency._avg.responseTime && previousPeriodLatency._avg.responseTime > 0
      ? ((avgLatency._avg.responseTime! - previousPeriodLatency._avg.responseTime) / previousPeriodLatency._avg.responseTime) * 100
      : 0

    const successRateChange = previousSuccessRate > 0
      ? currentSuccessRate - previousSuccessRate
      : 0

    return NextResponse.json({
      totalRequests,
      totalCost: totalCost._sum.cost || 0,
      avgLatency: avgLatency._avg.responseTime || 0,
      successRate: currentSuccessRate,
      changes: {
        requests: requestChange,
        cost: costChange,
        latency: latencyChange,
        successRate: successRateChange,
      },
    })

  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Dashboard Stats Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
