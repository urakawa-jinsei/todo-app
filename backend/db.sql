-- PostgreSQL用テーブル作成スクリプト

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL CHECK (status IN ('完了', '進行中', '未着手')),
    updated_at TIMESTAMP NOT NULL
);
