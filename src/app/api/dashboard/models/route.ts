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
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

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

    const totalRequests = modelUsage.reduce((sum, model) => sum + model._count.model, 0)

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
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Dashboard Models Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
