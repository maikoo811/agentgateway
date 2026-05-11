# 優秀なコーディングエージェントセッションのベストプラクティス

## 目次

1. [セッション開始時のアプローチ](#セッション開始時のアプローチ)
2. [計画とタスク管理](#計画とタスク管理)
3. [コード実装の原則](#コード実装の原則)
4. [コミュニケーション](#コミュニケーション)
5. [品質保証](#品質保証)
6. [ドキュメント化](#ドキュメント化)

---

## セッション開始時のアプローチ

### ✅ 良いアプローチ

1. **要件の完全な理解**
   - ユーザーのリクエストを正確に理解する
   - 不明な点は明確に質問する
   - 既存のコードベースを調査して文脈を把握する

2. **現状の確認**
   - 関連する既存コードを読む
   - データベーススキーマを確認する
   - 依存関係とアーキテクチャを理解する

3. **選択肢の提示**
   - 複数の実装アプローチがある場合は提示する
   - 各アプローチのメリット・デメリットを説明する
   - 推奨案とその理由を明確にする

### ❌ 避けるべきアプローチ

- 要件を推測して実装を開始する
- 既存コードを無視して新しい実装を追加する
- 選択肢を提示せずに一つの方法で進める

---

## 計画とタスク管理

### ✅ 効果的な計画

1. **タスクの分解**
   ```
   大きなタスク → 小さな具体的なタスクに分解
   ```

2. **優先順位の明確化**
   - 依存関係を考慮した順序
   - 重要度の高い機能から実装

3. **進捗の可視化**
   - タスクリストで進捗を管理
   - 完了したタスクを明確にマーク

### タスクリストの例

```markdown
- [ ] データベーススキーマの設計
- [ ] コアロジックの実装
- [ ] APIエンドポイントの作成
- [ ] フロントエンドコンポーネントの実装
- [ ] エラーハンドリングの追加
- [ ] テストと検証
```

---

## コード実装の原則

### 1. 段階的な実装

**良い例**:
```typescript
// ステップ1: 基本的な構造
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ステップ2: エラーハンドリングを追加
export function calculateTotal(items: Item[]): number {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ステップ3: 型安全性を強化
export function calculateTotal(items: Item[]): number {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => {
    if (item.price < 0) {
      throw new Error('Negative price not allowed');
    }
    return sum + item.price;
  }, 0);
}
```

### 2. 再利用可能な設計

**良い例**:
```typescript
// 汎用的なユーティリティ関数
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

// 複数の場所で使用可能
const result = await withErrorHandling(
  () => fetchData(),
  'データの取得に失敗しました'
);
```

### 3. 型安全性

**良い例**:
```typescript
// 明確な型定義
interface User {
  id: string;
  email: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function getUser(id: string): Promise<ApiResponse<User>> {
  // 実装
}
```

**悪い例**:
```typescript
// 型が不明確
async function getUser(id: any): Promise<any> {
  // 実装
}
```

### 4. エラーハンドリング

**良い例**:
```typescript
export async function processRequest(request: Request) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await validateAndProcess(request);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## コミュニケーション

### ✅ 効果的なコミュニケーション

1. **明確な説明**
   - 実装する内容を簡潔に説明
   - 技術的な選択の理由を説明
   - 複雑な部分は図や例を使用

2. **進捗の報告**
   - 各ステップの完了を報告
   - 問題が発生した場合は早期に報告
   - 次のステップを明確にする

3. **質問への対応**
   - ユーザーの質問に直接答える
   - 追加の説明が必要な場合は提供
   - 代替案がある場合は提示

### コミュニケーションの例

**良い例**:
> "データベーススキーマを拡張して、通知テーブルを追加しました。これにより、通知履歴を永続化できます。次に、通知を送信するAPIエンドポイントを実装します。"

**悪い例**:
> "スキーマを更新しました。次に進みます。"

---

## 品質保証

### 1. コードレビュー

実装後、以下の点を確認：

- [ ] 型エラーがない
- [ ] リンターエラーがない
- [ ] 既存のコードスタイルに準拠している
- [ ] エッジケースを考慮している
- [ ] エラーハンドリングが適切

### 2. テスト

**実装すべきテスト**:

```typescript
// 単体テストの例
describe('calculateTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should calculate sum correctly', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 },
    ];
    expect(calculateTotal(items)).toBe(60);
  });

  it('should throw error for negative price', () => {
    const items = [{ price: -10 }];
    expect(() => calculateTotal(items)).toThrow();
  });
});
```

### 3. パフォーマンス考慮

- 不要な再レンダリングを避ける
- データベースクエリの最適化
- インデックスの適切な使用
- キャッシュの活用

---

## ドキュメント化

### 1. コードコメント

**良い例**:
```typescript
/**
 * ユーザーのレート制限をチェックします。
 * 
 * @param userId - ユーザーID
 * @param endpoint - APIエンドポイント
 * @param configs - レート制限の設定（複数の時間ウィンドウをサポート）
 * @returns レート制限の結果（許可/拒否、残りリクエスト数など）
 * 
 * @example
 * const result = await checkRateLimit(
 *   'user123',
 *   '/api/v1/chat',
 *   [
 *     { windowMs: 60000, maxRequests: 10 },      // 1分: 10リクエスト
 *     { windowMs: 3600000, maxRequests: 100 },   // 1時間: 100リクエスト
 *   ]
 * );
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  configs: RateLimitConfig[]
): Promise<RateLimitResult> {
  // 実装
}
```

### 2. READMEの更新

新機能を追加した場合は、READMEを更新：

```markdown
## 新機能: リアルタイム通知

### 使用方法

1. 通知コンテキストをプロバイダーでラップ
2. `useNotifications`フックを使用して通知を管理
3. APIエラー時に自動的に通知が表示されます

### 設定

環境変数で通知の動作をカスタマイズできます：
- `NOTIFICATION_AUTO_DISMISS_TIME`: 自動削除までの時間（ミリ秒）
```

### 3. 変更ログ

重要な変更はCHANGELOGに記録：

```markdown
## [Unreleased]

### Added
- リアルタイム通知システム
- 通知履歴機能
- Server-Sent Eventsによるリアルタイム通信

### Changed
- エラーハンドリングを改善
- 通知コンポーネントのUIを更新
```

---

## セッション成功のチェックリスト

### 計画段階
- [ ] 要件を完全に理解した
- [ ] 既存コードを調査した
- [ ] 実装計画を立てた
- [ ] タスクリストを作成した

### 実装段階
- [ ] 段階的に実装した
- [ ] 型安全性を確保した
- [ ] エラーハンドリングを実装した
- [ ] コードスタイルに準拠した
- [ ] 再利用可能な設計にした

### 検証段階
- [ ] リンターエラーを修正した
- [ ] 型エラーを修正した
- [ ] 動作を確認した
- [ ] エッジケースをテストした

### 完了段階
- [ ] コードを整理した
- [ ] コメントを追加した
- [ ] ドキュメントを更新した
- [ ] ユーザーに完了を報告した

---

## よくある問題と解決策

### 問題1: 要件が不明確

**解決策**:
- 既存のコードから推測できる部分は実装
- 不明な点は明確に質問
- 複数の選択肢を提示してユーザーに決定を委ねる

### 問題2: 既存コードとの競合

**解決策**:
- 実装前に既存コードを十分に調査
- 既存のパターンに従う
- 大きな変更の場合は段階的に移行

### 問題3: パフォーマンスの問題

**解決策**:
- 実装後にパフォーマンスを測定
- ボトルネックを特定
- 必要に応じて最適化

### 問題4: テストの不足

**解決策**:
- 重要なロジックにはテストを追加
- エッジケースを考慮
- 統合テストも検討

---

## まとめ

優秀なコーディングエージェントセッションの特徴：

1. **体系的なアプローチ**: 計画 → 実装 → 検証 → 完了
2. **品質へのこだわり**: 型安全性、エラーハンドリング、テスト
3. **明確なコミュニケーション**: 説明、進捗報告、質問への対応
4. **再利用可能な設計**: 将来の拡張を考慮
5. **適切なドキュメント**: コードコメント、README、変更ログ

これらの原則に従うことで、高品質で保守しやすいコードを効率的に実装できます。

