import { NextRequest } from 'next/server'
import prisma from './prisma'

/**
 * Request log data interface
 */
export interface RequestLogData {
  userId: string
  apiKeyId?: string
  provider: string
  model: string
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  tokensUsed: number
  cost: number
  requestBody?: string
  responseBody?: string
  errorMessage?: string
  userAgent: string | null
  ipAddress: string
}

/**
 * Log API request to database
 * エラーが発生してもログ記録失敗でリクエストを止めない
 */
export async function logRequest(data: RequestLogData): Promise<void> {
  try {
    await prisma.request.create({
      data: {
        userId: data.userId,
        apiKeyId: data.apiKeyId,
        provider: data.provider,
        model: data.model,
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        tokensUsed: data.tokensUsed,
        cost: data.cost,
        requestBody: data.requestBody,
        responseBody: data.responseBody,
        errorMessage: data.errorMessage,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    })
  } catch (error) {
    // ログ記録失敗は重大ではないため、コンソールに出力するのみ
    console.error('Failed to log request:', error)
  }
}

/**
 * Extract client IP address from request
 */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Sanitize error message for client response
 * 内部エラー詳細を隠蔽し、ユーザー向けメッセージのみを返す
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // 本番環境では詳細を隠す
    if (process.env.NODE_ENV === 'production') {
      return 'An internal error occurred'
    }
    return error.message
  }
  return 'An unexpected error occurred'
}

/**
 * Truncate large strings for database storage
 * リクエスト/レスポンスボディが大きすぎる場合に切り詰める
 */
export function truncateString(str: string, maxLength: number = 50000): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength) + '... [truncated]'
}
