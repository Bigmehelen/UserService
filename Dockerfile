FROM node:20-slim

# Install OpenSSL for Prisma 7
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
