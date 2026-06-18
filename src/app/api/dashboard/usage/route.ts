import { NextRequest, NextResponse } from 'next/server'
import { authenticateSession } from '@/lib/auth-helpers'
import { sanitizeError } from '@/lib/api-utils'
import { AuthenticationError } from '@/lib/errors'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateSession(req)
    const userId = auth.userId

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

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

    const result = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      const dateStr = date.toISOString().split('T')[0]

      const dayData = (usageData as Array<{ date: string; requests: bigint | number }>).find(
        (d) => d.date === dateStr
      )
      result.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        requests: dayData ? Number(dayData.requests) : 0,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Dashboard Usage Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
