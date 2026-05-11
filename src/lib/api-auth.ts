import { NextRequest } from 'next/server'
import prisma from './prisma'
import crypto from 'crypto'

export async function authenticateApiKey(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const apiKey = authHeader.substring(7) // "Bearer " を除去

    // フルキーをハッシュ化
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')

    // ハッシュで直接検索（タイミング攻撃対策）
    const apiKeyRecord = await prisma.apiKey.findFirst({
      where: {
        key: hashedKey,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!apiKeyRecord) {
      return null
    }

    // 最終使用日時を更新（非同期で実行、エラーを無視）
    prisma.apiKey
      .update({
        where: {
          id: apiKeyRecord.id,
        },
        data: {
          lastUsedAt: new Date(),
        },
      })
      .catch((error) => {
        console.error('Failed to update API key last used time:', error)
      })

    return {
      userId: apiKeyRecord.userId,
      user: apiKeyRecord.user,
      apiKeyId: apiKeyRecord.id,
    }
  } catch (error) {
    console.error('API Key Authentication Error:', error)
    return null
  }
}


