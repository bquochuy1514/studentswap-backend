# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file khai báo dependency trước để tận dụng Docker layer cache
COPY package*.json ./
RUN npm ci

# Copy toàn bộ source code và tiến hành build
COPY . .
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Chỉ cài các dependency cần thiết cho môi trường chạy
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 8080

CMD ["node", "dist/main"]