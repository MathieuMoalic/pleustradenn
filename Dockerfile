FROM node:22-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .
RUN npm run build

CMD ["node", "./build/index.js"]
