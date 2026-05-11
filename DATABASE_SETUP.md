# データベースセットアップ手順

## 1. データベースの初期化

```bash
# データベーススキーマをプッシュ
DATABASE_URL="file:./dev.db" npx prisma db push

# または、npmが利用できない場合
DATABASE_URL="file:./dev.db" ./node_modules/.bin/prisma db push
```

## 2. サンプルデータの挿入

```bash
# シードスクリプトを実行
npm run db:seed

# または、npmが利用できない場合
DATABASE_URL="file:./dev.db" npx tsx scripts/seed-database.ts
```

## 3. データベースの確認

```bash
# Prisma Studioでデータベースを確認
npx prisma studio
```

## 4. 実際のダッシュボードの確認

http://localhost:3000/dashboard-real にアクセスして、実際のデータベースから取得したデータを確認できます。

## データベースの内容

### ユーザー
- **Email**: demo@agentgateway.com
- **Password**: password123
- **Name**: Demo User

### APIキー
- **Production API Key**: ag_7f8a9b2c_... (アクティブ)
- **Development API Key**: ag_3e4f5g6h_... (アクティブ)
- **Staging API Key**: ag_1a2b3c4d_... (非アクティブ)

### リクエストログ
- 過去30日分のサンプルデータ（1000+件）
- 複数のモデル（GPT-4o, Claude-3.5-Sonnet, GPT-4o-Mini, Claude-3.5-Haiku）
- 様々なステータスコード（200, 429, 500）
- リアルなコスト計算

## トラブルシューティング

### Node.js/npmが見つからない場合
1. Node.jsをインストール
2. パスを設定
3. または、直接バイナリを実行

### データベースファイルが見つからない場合
1. `prisma db push`を実行
2. `.env.local`ファイルで`DATABASE_URL`を確認

### シードスクリプトが失敗する場合
1. データベースが初期化されているか確認
2. 依存関係がインストールされているか確認
3. エラーメッセージを確認


