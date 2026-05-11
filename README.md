# LLM API Gateway

OpenAI/Anthropic へのプロキシAPIを提供するNext.js 14アプリケーションです。

## 機能

- 🔐 ユーザー認証 (NextAuth.js)
- 🔑 APIキー管理
- 📊 リクエストログ記録
- 📈 ダッシュボード (統計、グラフ、履歴)
- 🚀 OpenAI/Anthropic へのプロキシAPI

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **データベース**: Prisma (SQLite → 本番はPostgreSQL)
- **UI**: shadcn/ui + Tailwind CSS
- **認証**: NextAuth.js
- **グラフ**: Recharts

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""

# LLM API Keys
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# App Configuration
NODE_ENV="development"
```

### 3. データベースの初期化

```bash
npx prisma generate
npx prisma db push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API ルート
│   ├── auth/              # 認証ページ
│   ├── dashboard/         # ダッシュボード
│   └── globals.css        # グローバルスタイル
├── components/            # React コンポーネント
├── lib/                   # ユーティリティ関数
│   ├── auth.ts           # NextAuth 設定
│   └── prisma.ts         # Prisma クライアント
└── types/                # TypeScript 型定義
```

## 主要な機能

### 認証
- GitHub/Google OAuth
- メール/パスワード認証
- セッション管理

### ダッシュボード
- 使用量統計
- リアルタイムグラフ
- リクエスト履歴
- APIキー管理

### API プロキシ
- OpenAI API へのプロキシ
- Anthropic API へのプロキシ
- リクエスト/レスポンスのログ記録
- レート制限とコスト追跡

## 開発

### データベース操作

```bash
# マイグレーションの実行
npm run db:migrate

# データベースのリセット
npx prisma db push --force-reset

# Prisma Studio の起動
npm run db:studio
```

### ビルド

```bash
npm run build
npm start
```

## ライセンス

MIT

---

## Context

agentgateway is one of several AI agent infrastructure prototypes leading to **Clearline Technologies** — the AI CTO for non-technical founders building with AI. The infrastructure work here informed our thinking on reliable, multi-provider LLM access for non-technical builders. See the [Clearline manifesto](https://github.com/maikoo811/clearline-manifesto) for the broader thesis.

Built by [Maiko Kojima](https://github.com/maikoo811) · CEO @ Clearline Technologies
