FROM node:18-alpine

WORKDIR /app

# package.json と tsconfig.json をコピー
COPY package.json tsconfig.json ./

# 依存関係をインストール
RUN npm install

# 型定義ファイルをインストール
RUN npm install --save-dev @types/react @types/react-dom

# 残りのファイルをコピー
COPY public ./public
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
