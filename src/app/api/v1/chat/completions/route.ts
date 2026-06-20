import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-helpers'
import { logRequest, getClientIp, sanitizeError, truncateString } from '@/lib/api-utils'
import { calculateCost, estimateTokenSplit } from '@/lib/pricing'
import { AuthenticationError, ExternalApiError } from '@/lib/errors'

// OpenAI API プロキシ
export async function POST(req: NextRequest) {
  const startTime = Date.now()
  let userId: string | undefined
  let apiKeyId: string | undefined

  try {
    // 認証
    const auth = await authenticateRequest(req)
    userId = auth.userId
    apiKeyId = auth.apiKeyId

    // リクエストボディを取得
    const body = await req.json()
    const { model, messages, max_tokens, temperature, stream } = body

    const selectedModel = model || 'gpt-3.5-turbo'

    // APIキーを取得（環境変数から）
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // OpenAI APIにリクエストを転送
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
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

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      const errorMessage = errorData.error?.message || 'OpenAI API error'

      // エラーもログに記録
      await logRequest({
        userId,
        apiKeyId,
        provider: 'openai',
        model: selectedModel,
        endpoint: '/v1/chat/completions',
        method: 'POST',
        statusCode: openaiResponse.status,
        responseTime,
        tokensUsed: 0,
        cost: 0,
        requestBody: truncateString(JSON.stringify(body)),
        responseBody: truncateString(JSON.stringify(errorData)),
        errorMessage,
        userAgent: req.headers.get('user-agent'),
        ipAddress: getClientIp(req),
      })

      throw new ExternalApiError('OpenAI', errorMessage, openaiResponse.status)
    }

    const responseData = await openaiResponse.json()
    const totalTokens = responseData.usage?.total_tokens || 0
    const { input, output } = estimateTokenSplit(totalTokens)

    // コスト計算
    const cost = calculateCost('openai', selectedModel, input, output)

    // リクエストをログに記録
    await logRequest({
      userId,
      apiKeyId,
      provider: 'openai',
      model: selectedModel,
      endpoint: '/v1/chat/completions',
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
        provider: 'openai',
        model: 'unknown',
        endpoint: '/v1/chat/completions',
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

    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}

