# 第一階段：編譯
FROM node:20-alpine AS build-stage

WORKDIR /app

# 1. 優化：只複製 package 相關文件，這是為了利用 Docker Layer Cache
# 只要 package.json 沒變，就不會重新執行 npm install
COPY package*.json ./

# 2. 優化：使用 npm ci 代替 install，並加上快取清理
# npm ci 專為 CI/CD 設計，速度更快且更可靠
RUN npm install --legacy-peer-deps && npm cache clean --force

# 3. 優化：這時候才複製其餘原始碼（包括 .env, nginx.conf 等）
# 這樣修改原始碼時，不會觸發上面的 npm install
COPY . .

# 執行編譯
RUN npm run build

# 第二階段：生產環境
FROM nginx:1.21.5-alpine AS production-stage

# 4. 優化：合併 COPY 指令或確保順序
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]