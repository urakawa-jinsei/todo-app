FROM node:18-alpine

WORKDIR /app

# package.json と tsconfig.json をコピー
COPY package.json tsconfig.json ./

# 依存関係のインストール
RUN npm install

# ホットリロード用の環境変数を設定
ENV CHOKIDAR_USEPOLLING=true

# public と src は docker-compose でボリュームマウントするためコピーは不要（必要に応じてコピーも可）
COPY public ./public
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
