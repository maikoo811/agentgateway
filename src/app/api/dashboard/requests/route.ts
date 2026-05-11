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

    // クエリパラメータを取得
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 最近のリクエストを取得
    const requests = await prisma.request.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        provider: true,
        model: true,
        statusCode: true,
        responseTime: true,
        tokensUsed: true,
        cost: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // フォーマット
    const formattedRequests = requests.map(req => ({
      id: req.id,
      time: req.createdAt.toLocaleTimeString('ja-JP', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      model: req.model,
      tokens: req.tokensUsed?.toLocaleString() || '0',
      cost: req.cost ? `$${req.cost.toFixed(4)}` : '$0.0000',
      status: req.statusCode >= 200 && req.statusCode < 300 ? 'success' : 'error',
    }))

    return NextResponse.json({ requests: formattedRequests })

  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Dashboard Requests Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
