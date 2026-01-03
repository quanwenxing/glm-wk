# 中学受験学習サイト

中学受験を準備している小学生向けの、画像や動画を活用しながら楽しく勉強できる学習サイトです。

## プロジェクト概要

- **対象**: 小学4年生〜6年生の中学受験生
- **目的**: 塾での学習テーマの予習・復習
- **対象科目**: 国語・算数・理科・社会
- **対応デバイス**: PC・タブレット・スマートフォン（レスポンシブ対応）

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org) (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **認証**: NextAuth.js（予定）
- **データベース**: Cloudflare D1（予定）
- **ホスティング**: Cloudflare Pages（予定）

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd glm-wk
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセスして確認してください。

## プロジェクト構成

```
/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── subjects/          # 科目一覧
│   ├── themes/            # テーマ詳細
│   └── quiz/              # クイズ
├── components/            # Reactコンポーネント
│   └── ui/               # shadcn/ui コンポーネント
├── lib/                  # ユーティリティ関数
├── public/               # 静的ファイル（画像、ドキュメント）
└── content/              # コンテンツデータ（JSON/Markdown）
```

## 開発ガイド

### プロジェクト管理

- [要件定義書](./requirements.md) - プロジェクトの要件定義
- [開発プロジェクト管理ガイド](./docs/PROJECT_MANAGEMENT.md) - GitHub Projectsのセットアップや開発フロー

### タスク管理

- GitHub Projects でタスク管理
- [Issues](../../issues) で各タスクを管理
- 朝のスタンドアップ・週次進捗会議で進捗共有

### ブランチ戦略

```
main (本番環境)
  └── feature/機能名
```

## ライセンス

TBD
