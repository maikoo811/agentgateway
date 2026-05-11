import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // 一時的に認証をスキップ
    const userId = 'demo-user-id'

    // 期間を取得（デフォルトは過去30日）
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // モデル別の使用量を取得
    const modelUsage = await prisma.request.groupBy({
      by: ['model'],
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      _count: { model: true },
      orderBy: {
        _count: { model: 'desc' },
      },
    })

    // 総リクエスト数を計算
    const totalRequests = modelUsage.reduce((sum, model) => sum + model._count.model, 0)

    // パーセンテージを計算してフォーマット
    const formattedData = modelUsage.map((model, index) => {
      const percentage = totalRequests > 0 ? (model._count.model / totalRequests) * 100 : 0
      const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B']
      
      return {
        name: model.model,
        value: Math.round(percentage),
        count: model._count.model,
        color: colors[index % colors.length],
      }
    })

    return NextResponse.json(formattedData)

  } catch (error) {
    console.error('Dashboard Models Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
