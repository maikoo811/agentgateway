import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // 一時的に認証をスキップ
    const userId = 'demo-user-id'

    // 期間を取得（デフォルトは過去7日）
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = new Date()
    startDate.getDate() - days

    // 日別のリクエスト数を取得
    const usageData = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as requests
      FROM Request 
      WHERE userId = ${userId} 
        AND createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `

    // 日付の配列を生成してデータを補完
    const result = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      const dateStr = date.toISOString().split('T')[0]
      
      const dayData = (usageData as any[]).find(d => d.date === dateStr)
      result.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        requests: dayData ? parseInt(dayData.requests) : 0,
      })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Dashboard Usage Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
