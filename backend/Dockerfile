# Golang1.25の公式イメージを使用
FROM golang:1.25

# Airをインストール
RUN go install github.com/air-verse/air@latest

WORKDIR /app

# go.mod, go.sum をコピーして依存関係をダウンロード
COPY go.mod go.sum ./
RUN go mod download

# 残りのソースコードと .air.toml をコピー
COPY . .

# ポート公開
EXPOSE 8080

# airを使ってホットリロードを実行
CMD ["air", "-c", ".air.toml"]
