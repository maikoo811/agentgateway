import { NextRequest, NextResponse } from 'next/server'
import { authenticateSession } from '@/lib/auth-helpers'
import { sanitizeError } from '@/lib/api-utils'
import { AuthenticationError, ValidationError } from '@/lib/errors'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

// APIキー作成スキーマ
const createApiKeySchema = z.object({
  name: z.string().min(1, 'APIキー名は必須です').max(100, 'APIキー名は100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
})

// APIキー一覧取得
export async function GET(req: NextRequest) {
  try {
    // セッション認証（ダッシュボード用）
    const auth = await authenticateSession(req)

    const apiKeys = await prisma.apiKey.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('API Keys GET Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}

// APIキー作成
export async function POST(req: NextRequest) {
  try {
    // セッション認証（ダッシュボード用）
    const auth = await authenticateSession(req)

    const body = await req.json()
    const validatedData = createApiKeySchema.parse(body)

    // APIキーを生成
    const keyPrefix = 'ag_' + crypto.randomBytes(8).toString('hex')
    const keySuffix = crypto.randomBytes(32).toString('hex')
    const fullKey = `${keyPrefix}_${keySuffix}`

    // データベースに保存（フルキーはハッシュ化して保存）
    const hashedKey = crypto.createHash('sha256').update(fullKey).digest('hex')

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: auth.userId,
        name: validatedData.name,
        description: validatedData.description,
        keyPrefix,
        key: hashedKey,
        isActive: true,
      },
    })

    // レスポンスではフルキーを返す（この時点でのみ表示）
    return NextResponse.json(
      {
        id: apiKey.id,
        name: apiKey.name,
        description: apiKey.description,
        key: fullKey, // 作成時のみフルキーを返す
        keyPrefix: apiKey.keyPrefix,
        isActive: apiKey.isActive,
        createdAt: apiKey.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('API Key Creation Error:', error)
    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
