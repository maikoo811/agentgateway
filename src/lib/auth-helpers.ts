import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { authenticateApiKey } from './api-auth'
import { AuthenticationError } from './errors'

/**
 * Authentication result
 */
export interface AuthResult {
  userId: string
  apiKeyId?: string
  user?: {
    id: string
    email: string | null
    name: string | null
  }
}

/**
 * Authenticate user from session or API key
 * セッション認証またはAPIキー認証を試行
 *
 * @param req - NextRequest object
 * @returns AuthResult if authenticated, throws AuthenticationError otherwise
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  // まずセッション認証を試行
  const session = await getServerSession(authOptions)

  if (session?.user?.id) {
    return {
      userId: session.user.id,
      user: {
        id: session.user.id,
        email: session.user.email || null,
        name: session.user.name || null,
      },
    }
  }

  // セッションがない場合、APIキー認証を試行
  const apiAuth = await authenticateApiKey(req)

  if (apiAuth) {
    return {
      userId: apiAuth.userId,
      apiKeyId: apiAuth.apiKeyId,
      user: apiAuth.user,
    }
  }

  // どちらも失敗した場合は認証エラー
  throw new AuthenticationError('Authentication required. Please provide a valid session or API key.')
}

/**
 * Authenticate user from session only (for dashboard endpoints)
 * ダッシュボード用：セッション認証のみ
 */
export async function authenticateSession(req: NextRequest): Promise<AuthResult> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new AuthenticationError('Please sign in to access this resource')
  }

  return {
    userId: session.user.id,
    user: {
      id: session.user.id,
      email: session.user.email || null,
      name: session.user.name || null,
    },
  }
}
