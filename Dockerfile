# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production образ
FROM nginx:alpine

# Копируем собранное приложение в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Конфигурация nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]