# Token Ops セットアップ

[Token Ops](https://github.com/maikoo811/token-ops) をこのプロジェクトに導入済みです。

## 導入内容

| 項目 | 状態 |
|---|---|
| グローバル CLI (`token-ops`) | インストール済み (v0.6.2) |
| Cursor プロジェクトルール | `.cursor/rules/token-ops.mdc` |
| `.gitignore` 更新 | Token Ops ローカルファイルを除外 |
| グローバル MCP (`~/.cursor/mcp.json`) | `token-ops` サーバー登録済み |

## 動作確認

1. **Cursor を再起動**（`Cmd+Q` で終了 → プロジェクトを開き直す）
2. いくつかコーディング系のプロンプトを送る（例: `fix...`, `refactor...`, `バグ...`）
3. ターミナルでレポートを確認:

```sh
token-ops report
```

`Runs: N`（N > 0）ならフック／ルールが動いています。

## 参考コマンド

```sh
# 節約レポート
token-ops report

# コンテキストコスト見積もり
token-ops cost

# 高コストファイル一覧
token-ops high-cost-files

# アンインストール（このプロジェクトのみ）
token-ops uninstall cursor
```

## MCP ツール

Cursor チャットから利用できるツール:

- `build_compact_context` — タスク向けのコンパクトなコンテキストパックを生成
- `estimate_context_cost` — 選択ファイル／リポジトリ全体のコンテキストコストを推定
- `list_high_cost_files` — コンテキストに載せると高コストなファイルを列挙
- `report_saved_tokens` — 節約トークン数のレポートを表示
