# TODOアプリケーション

このプロジェクトは、Golang (net/http: Golang1.22 の新ルーティング機能)、React (TypeScript, Tailwind CSS) および PostgreSQL を使用したシンプルな TODO アプリケーションです。  
Docker-compose を利用して、バックエンド、フロントエンド、データベースの各環境が立ち上がる構成となっています。

## API エンドポイント

- **GET /tasks**  
  タスク一覧の取得（更新日時が新しい順）

- **POST /tasks**  
  タスクの新規登録  
  リクエストボディに JSON 形式でタスク情報を指定してください。

- **PUT /tasks/{id}**  
  タスクの更新  
  URL の `{id}` に更新対象のタスクIDを指定し、リクエストボディに更新内容を JSON 形式で送信してください。

- **DELETE /tasks/{id}**  
  タスクの削除  
  URL の `{id}` に削除対象のタスクIDを指定してください。

## 起動方法

1. リポジトリをクローンまたはダウンロードします。

2. プロジェクトルートで以下のコマンドを実行して、Dockerコンテナをビルド・起動します。

   ```bash
   docker-compose up --build
