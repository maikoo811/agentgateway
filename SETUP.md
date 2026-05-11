# セットアップガイド

このガイドでは、改善されたLLM API Gatewayのセットアップ手順を説明します。

## 前提条件

- Node.js 18以上
- npm または yarn

## 初期セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
# .env.exampleをコピー
cp .env.example .env

# .envファイルを編集
```

**重要**: 以下の環境変数を必ず設定してください：

```bash
# セキュアなランダム文字列を生成
openssl rand -base64 32

# .envファイルに貼り付け
NEXTAUTH_SECRET="生成された文字列"

# LLM APIキーを設定
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
```

### 3. データベースのセットアップ

```bash
# Prismaクライアントを生成
npx prisma generate

# データベーススキーマをプッシュ
npx prisma db push

# サンプルデータを投入（オプション）
npm run db:seed
```

### 4. ビルドと起動

```bash
# 開発サーバーを起動
npm run dev

# 本番ビルド
npm run build
npm start
```

## 初回ログイン

1. ブラウザで `http://localhost:3000` にアクセス
2. サインアップページで新規アカウントを作成
   - メール: 任意
   - パスワード: 6文字以上
3. ログイン後、ダッシュボードが表示されます

## APIキーの作成

1. ダッシュボードの「APIキー」タブに移動
2. 「新規作成」をクリック
3. APIキー名と説明（オプション）を入力
4. **重要**: 作成されたAPIキーは1回のみ表示されます。必ず保存してください

## API使用例

### OpenAI API経由

```bash
curl -X POST http://localhost:3000/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'
```

### Anthropic API経由

```bash
curl -X POST http://localhost:3000/api/v1/messages \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'
```

## ヘルスチェック

```bash
curl http://localhost:3000/api/health
```

成功レスポンス:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "checks": {
    "database": "connected"
  },
  "responseTime": "5ms"
}
```

## トラブルシューティング

### データベース接続エラー

```bash
# Prismaクライアントを再生成
npx prisma generate

# データベースをリセット（警告: 全データ削除）
npx prisma db push --force-reset
```

### APIキー認証エラー

- APIキーが正しくコピーされているか確認
- `Bearer `プレフィックスが付いているか確認
- APIキーが有効（isActive=true）か確認

### ビルドエラー

```bash
# node_modulesとキャッシュをクリア
rm -rf node_modules .next
npm install
npm run build
```

## 開発用コマンド

```bash
# データベース管理画面を開く
npm run db:studio

# マイグレーション作成
npx prisma migrate dev --name migration_name

# TypeScriptの型チェック
npx tsc --noEmit

# リンター実行
npm run lint
```

## 本番環境へのデプロイ

### 環境変数の設定

本番環境では以下の変更が必要です：

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### デプロイ前チェックリスト

- [ ] NEXTAUTH_SECRETが本番用の強力な値に設定されている
- [ ] データベースがPostgreSQLに移行されている
- [ ] 全ての環境変数が正しく設定されている
- [ ] `npm run build`が成功する
- [ ] `/api/health`が200を返す
- [ ] .envファイルがGitignoreに含まれている

## セキュリティ推奨事項

1. **NEXTAUTH_SECRET**: 必ず本番用の強力なランダム文字列を使用
2. **APIキー**: 定期的にローテーション
3. **HTTPS**: 本番環境では必ずHTTPSを使用
4. **レート制限**: 将来的にレート制限の実装を推奨
5. **監視**: `/api/health`エンドポイントを定期的に監視

## 次のステップ

- `IMPROVEMENTS.md`で実装済みの改善を確認
- レビューレポートで推奨される追加機能を検討
- PostgreSQLへの移行を計画
- レート制限の実装
- 監視ツール（Sentry, Uptime Robot等）の統合

## サポート

問題が発生した場合は、以下を確認してください：

1. このドキュメントのトラブルシューティングセクション
2. `IMPROVEMENTS.md`の実装詳細
3. Prismaドキュメント: https://www.prisma.io/docs
4. Next.jsドキュメント: https://nextjs.org/docs
