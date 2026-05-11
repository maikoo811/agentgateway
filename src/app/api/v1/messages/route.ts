import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-helpers'
import { logRequest, getClientIp, sanitizeError, truncateString } from '@/lib/api-utils'
import { calculateCost } from '@/lib/pricing'
import { AuthenticationError, ExternalApiError } from '@/lib/errors'

// Anthropic API プロキシ
export async function POST(req: NextRequest) {
  const startTime = Date.now()
  let userId: string
  let apiKeyId: string | undefined

  try {
    // 認証
    const auth = await authenticateRequest(req)
    userId = auth.userId
    apiKeyId = auth.apiKeyId

    // リクエストボディを取得
    const body = await req.json()
    const { model, messages, max_tokens, temperature, stream } = body

    const selectedModel = model || 'claude-3-5-sonnet-20241022'

    // APIキーを取得（環境変数から）
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured')
    }

    // Anthropic APIにリクエストを転送
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        max_tokens: max_tokens || 1000,
        temperature: temperature || 0.7,
        stream: stream || false,
      }),
    })

    const responseTime = Date.now() - startTime

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.json()
      const errorMessage = errorData.error?.message || 'Anthropic API error'

      // エラーもログに記録
      await logRequest({
        userId,
        apiKeyId,
        provider: 'anthropic',
        model: selectedModel,
        endpoint: '/v1/messages',
        method: 'POST',
        statusCode: anthropicResponse.status,
        responseTime,
        tokensUsed: 0,
        cost: 0,
        requestBody: truncateString(JSON.stringify(body)),
        responseBody: truncateString(JSON.stringify(errorData)),
        errorMessage,
        userAgent: req.headers.get('user-agent'),
        ipAddress: getClientIp(req),
      })

      throw new ExternalApiError('Anthropic', errorMessage, anthropicResponse.status)
    }

    const responseData = await anthropicResponse.json()
    const inputTokens = responseData.usage?.input_tokens || 0
    const outputTokens = responseData.usage?.output_tokens || 0
    const totalTokens = inputTokens + outputTokens

    // コスト計算（Anthropicは実際のinput/outputトークン数を返す）
    const cost = calculateCost('anthropic', selectedModel, inputTokens, outputTokens)

    // リクエストをログに記録
    await logRequest({
      userId,
      apiKeyId,
      provider: 'anthropic',
      model: selectedModel,
      endpoint: '/v1/messages',
      method: 'POST',
      statusCode: 200,
      responseTime,
      tokensUsed: totalTokens,
      cost,
      requestBody: truncateString(JSON.stringify(body)),
      responseBody: truncateString(JSON.stringify(responseData)),
      userAgent: req.headers.get('user-agent'),
      ipAddress: getClientIp(req),
    })

    return NextResponse.json(responseData)
  } catch (error) {
    const responseTime = Date.now() - startTime

    // 認証エラーの場合
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    // 外部APIエラーの場合
    if (error instanceof ExternalApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    // その他のエラー
    console.error('API Proxy Error:', error)

    // エラーログを記録（userIdがある場合のみ）
    if (userId) {
      await logRequest({
        userId,
        apiKeyId,
        provider: 'anthropic',
        model: 'unknown',
        endpoint: '/v1/messages',
        method: 'POST',
        statusCode: 500,
        responseTime,
        tokensUsed: 0,
        cost: 0,
        errorMessage: sanitizeError(error),
        userAgent: req.headers.get('user-agent'),
        ipAddress: getClientIp(req),
      })
    }

    return NextResponse.json({ error: sanitizeError(error) }, { status: 500 })
  }
}
