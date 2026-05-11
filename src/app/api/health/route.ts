import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Health check endpoint
 * 本番環境での監視・アラート用
 */
export async function GET() {
  const startTime = Date.now()

  try {
    // データベース接続チェック
    await prisma.$queryRaw`SELECT 1`

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',
      },
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
