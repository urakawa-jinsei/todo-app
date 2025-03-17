# TODOアプリ

## アプリ概要
このTODOアプリは、バックエンドにGolang、フロントエンドにReact (TypeScript) とTailwind CSSを使用したシンプルなタスク管理システムです。  
タスクの一覧表示、詳細編集、ドラッグ＆ドロップによるステータス変更など、基本的な機能を提供します。

## 技術スタック

### バックエンド
![Golang](https://img.shields.io/badge/Golang-1.22-blue)
- Golang を用いたAPIサーバー
- net/http によるシンプルなルーティング
- ホットリロード (Air)

### フロントエンド
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2.7-blue)
- React と TypeScript で構築
- Tailwind CSS によるスタイリング
- react-beautiful-dnd によるドラッグ＆ドロップ

### その他
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Swagger](https://img.shields.io/badge/Swagger-UI-orange)
- PostgreSQL によるデータベース管理
- Swagger によるAPIドキュメント (Dockerで提供)
- ホットリロード機能 (Air)

## プロジェクト構成

```
todo-app/
├── backend/              # Golangバックエンド
│   ├── main.go           # エントリーポイント
│   ├── go.mod, go.sum    # モジュール定義ファイル
│   └── db.sql            # データベーススキーマ
├── frontend/             # Reactフロントエンド
│   ├── package.json      # 依存関係とスクリプト
│   ├── tailwind.config.js# Tailwind CSS設定ファイル
│   └── src/              # ソースコード (TaskList.tsx, TaskDetail.tsx, api.tsなど)
├── docker-compose.yaml   # Docker Compose設定ファイル
└── README.md             # このドキュメント
```

## 機能紹介

- **タスク一覧画面**
  - テーブルビューとボードビューの切り替え機能
  - ボードビューでは、タスクをドラッグ＆ドロップしてステータス変更が可能
  - 検索・ステータス絞り込み機能
  - 新規タスクの追加

- **タスク詳細画面**
  - タスクの内容（名前、詳細、ステータス）の編集
  - 保存・削除機能（保存後は一覧画面に戻る）

- **APIドキュメント**
  - Swagger UI によるAPI仕様の確認 (Dockerで利用可能)

## Dockerでの起動方法

1. **Docker Composeを用いて全コンテナをビルド＆起動**

   プロジェクトルートで以下のコマンドを実行してください。

   ```bash
   docker-compose up --build
   ```

2. **アクセス方法**
   - **フロントエンド:** [http://localhost:3000](http://localhost:3000)
   - **バックエンド API:** [http://localhost:8080](http://localhost:8080)
   - **Swagger UI:** [http://localhost:8081](http://localhost:8081) *(Swagger UIサービスを利用している場合)*
