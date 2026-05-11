import { NextRequest, NextResponse } from 'next/server'
import { authenticateSession } from '@/lib/auth-helpers'
import { sanitizeError } from '@/lib/api-utils'
import { AuthenticationError, NotFoundError, AuthorizationError } from '@/lib/errors'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// APIキー更新スキーマ
const updateApiKeySchema = z.object({
  name: z.string().min(1, 'APIキー名は必須です').max(100).optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
})

// APIキー詳細取得
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッション認証（ダッシュボード用）
    const auth = await authenticateSession(req)

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!apiKey) {
      throw new NotFoundError('API key')
    }

    return NextResponse.json({ apiKey })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('API Key GET Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}

// APIキー更新
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッション認証（ダッシュボード用）
    const auth = await authenticateSession(req)

    const body = await req.json()
    const updateData = updateApiKeySchema.parse(body)

    // APIキーの存在確認と所有者確認
    const existingApiKey = await prisma.apiKey.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
    })

    if (!existingApiKey) {
      throw new NotFoundError('API key')
    }

    const updatedApiKey = await prisma.apiKey.update({
      where: {
        id: params.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ apiKey: updatedApiKey })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('API Key Update Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}

// APIキー削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッション認証（ダッシュボード用）
    const auth = await authenticateSession(req)

    // APIキーの存在確認と所有者確認
    const existingApiKey = await prisma.apiKey.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
    })

    if (!existingApiKey) {
      throw new NotFoundError('API key')
    }

    // トランザクションで削除
    await prisma.$transaction(async (tx) => {
      // 関連するリクエストのapiKeyIdをnullに設定
      await tx.request.updateMany({
        where: { apiKeyId: params.id },
        data: { apiKeyId: null },
      })

      // APIキーを削除
      await tx.apiKey.delete({
        where: { id: params.id },
      })
    })

    return NextResponse.json({ message: 'API key deleted successfully' })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('API Key Delete Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
