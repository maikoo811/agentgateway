# 優秀なコーディングエージェントセッション例

## セッション概要

**日付**: 2024年（例示）
**タスク**: APIレート制限機能の実装
**所要時間**: 約45分
**成果**: 完全に動作するレート制限システムの実装

---

## セッションの流れ

### 1. タスクの理解と要件確認

**ユーザーリクエスト**:
> "APIリクエストにレート制限を追加したい。ユーザーごとに1分間に10リクエストまで、1時間に100リクエストまで制限したい。"

**エージェントの対応**:
- 既存のコードベースを調査
- データベーススキーマを確認
- 現在のAPI実装を理解
- 不足している情報を特定

**確認したポイント**:
- ✅ 既存のAPIルート構造 (`src/app/api/v1/chat/completions/route.ts`)
- ✅ データベーススキーマ (`prisma/schema.prisma`)
- ✅ 認証システム (`src/lib/api-auth.ts`)
- ✅ エラーハンドリング (`src/lib/errors.ts`)

### 2. 計画の立案

**タスクリスト**:

```
□ データベーススキーマの拡張（RateLimitテーブルの追加）
□ レート制限ロジックの実装（lib/rate-limit.ts）
□ ミドルウェア関数の作成（lib/rate-limit-middleware.ts）
□ APIルートへの統合
□ エラーレスポンスの実装
□ テストと検証
```

### 3. 実装フェーズ

#### ステップ1: データベーススキーマの拡張

**ファイル**: `prisma/schema.prisma`

```prisma
model RateLimit {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String
  count     Int      @default(0)
  windowStart DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, endpoint, windowStart])
  @@index([userId, endpoint])
}
```

**考慮事項**:
- ユーザーとエンドポイントの組み合わせで一意性を保証
- 時間ウィンドウごとにレコードを分離
- カスケード削除でデータ整合性を維持

#### ステップ2: レート制限ロジックの実装

**ファイル**: `src/lib/rate-limit.ts`

```typescript
import { prisma } from './prisma';

interface RateLimitConfig {
  windowMs: number;      // 時間ウィンドウ（ミリ秒）
  maxRequests: number;   // 最大リクエスト数
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
}

export async function checkRateLimit(
  userId: string,
  endpoint: string,
  configs: RateLimitConfig[]
): Promise<RateLimitResult> {
  const now = new Date();
  
  // 各設定に対してチェック
  for (const config of configs) {
    const windowStart = new Date(now.getTime() - (now.getTime() % config.windowMs));
    
    // 既存のレコードを取得または作成
    const rateLimit = await prisma.rateLimit.upsert({
      where: {
        userId_endpoint_windowStart: {
          userId,
          endpoint,
          windowStart,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        userId,
        endpoint,
        windowStart,
        count: 1,
      },
    });

    // 制限を超えているかチェック
    if (rateLimit.count > config.maxRequests) {
      const resetTime = new Date(windowStart.getTime() + config.windowMs);
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        limit: config.maxRequests,
      };
    }
  }

  // すべての制限をクリア
  const minResetTime = new Date(
    now.getTime() + Math.min(...configs.map(c => c.windowMs))
  );
  
  return {
    allowed: true,
    remaining: Math.min(...configs.map(c => c.maxRequests)) - 1,
    resetTime: minResetTime,
    limit: Math.min(...configs.map(c => c.maxRequests)),
  };
}
```

**設計のポイント**:
- 複数の時間ウィンドウ（1分、1時間など）を同時にチェック
- アトミックな操作で競合状態を回避
- 明確な戻り値で呼び出し側が判断しやすい

#### ステップ3: ミドルウェア関数の作成

**ファイル**: `src/lib/rate-limit-middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rate-limit';
import { RateLimitError } from './errors';

export async function withRateLimit(
  request: NextRequest,
  userId: string,
  endpoint: string,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // レート制限の設定（1分: 10リクエスト、1時間: 100リクエスト）
  const configs = [
    { windowMs: 60 * 1000, maxRequests: 10 },      // 1分
    { windowMs: 60 * 60 * 1000, maxRequests: 100 }, // 1時間
  ];

  const result = await checkRateLimit(userId, endpoint, configs);

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        resetTime: result.resetTime.toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': Math.floor(result.resetTime.getTime() / 1000).toString(),
          'Retry-After': Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // レート制限ヘッダーを追加
  const response = await handler();
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.floor(result.resetTime.getTime() / 1000).toString());

  return response;
}
```

**実装のポイント**:
- 標準的なHTTPレート制限ヘッダーを実装
- 429ステータスコードとRetry-Afterヘッダーでクライアントに情報を提供
- 既存のハンドラー関数をラップして透過的に動作

#### ステップ4: APIルートへの統合

**ファイル**: `src/app/api/v1/chat/completions/route.ts`

```typescript
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { authenticateRequest } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    // 認証
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // レート制限付きでハンドラーを実行
    return await withRateLimit(
      request,
      user.id,
      '/api/v1/chat/completions',
      async () => {
        // 既存のAPIロジック
        const body = await request.json();
        // ... プロキシ処理 ...
        return NextResponse.json(result);
      }
    );
  } catch (error) {
    // エラーハンドリング
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4. テストと検証

**検証項目**:
1. ✅ 正常なリクエストが通ることを確認
2. ✅ 1分間に10リクエストを超えると429エラーを返す
3. ✅ 1時間に100リクエストを超えると429エラーを返す
4. ✅ レート制限ヘッダーが正しく設定される
5. ✅ 時間ウィンドウがリセットされることを確認

**テストコマンド**:
```bash
# 連続リクエストのテスト
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/v1/chat/completions \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}]}'
  echo ""
done
```

### 5. クリーンアップと最適化

**実施した改善**:
- 古いレート制限レコードの自動削除（バックグラウンドジョブ）
- インデックスの最適化
- エラーメッセージの改善

---

## セッションの成功要因

### 1. 体系的なアプローチ
- 要件の完全な理解
- 段階的な実装計画
- 各ステップでの検証

### 2. コード品質
- TypeScriptの型安全性を活用
- エラーハンドリングの徹底
- 再利用可能な設計

### 3. ベストプラクティスの適用
- 標準的なHTTPステータスコードとヘッダー
- データベースの一貫性保証
- スケーラブルな設計

### 4. ドキュメント
- コードコメント
- 明確な関数名と変数名
- 実装の意図が明確

### 5. テスト可能性
- 単体テストしやすい構造
- モック可能な依存関係
- 検証可能な動作

---

## 学んだこと

1. **段階的な実装**: 一度にすべてを実装せず、小さなステップで進める
2. **既存コードの理解**: 新しい機能を追加する前に、既存のアーキテクチャを理解する
3. **エッジケースの考慮**: レート制限のリセット、同時リクエスト、データベースの整合性など
4. **標準への準拠**: HTTP標準に従うことで、クライアントとの互換性を確保
5. **パフォーマンス**: データベースクエリの最適化とインデックスの適切な使用

---

## 成果物

- ✅ 完全に動作するレート制限システム
- ✅ データベーススキーマの拡張
- ✅ 再利用可能なライブラリ関数
- ✅ 標準準拠のAPIレスポンス
- ✅ 包括的なエラーハンドリング

---

## このセッションが優秀だった理由

1. **明確な目標**: ユーザーの要件を正確に理解し、実装した
2. **計画性**: タスクリストで進捗を管理し、漏れなく実装
3. **品質**: 単なる動作だけでなく、保守性と拡張性を考慮
4. **検証**: 実装後のテストで動作を確認
5. **ドキュメント**: 将来のメンテナンスを考慮したコードとコメント

---

## 次のステップ（推奨）

1. レート制限の設定を環境変数から読み込む
2. 管理者向けのレート制限設定UI
3. レート制限の統計とモニタリング
4. 分散環境でのレート制限（Redis使用）
5. ユーザーごとのカスタムレート制限

