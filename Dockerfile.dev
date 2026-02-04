# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Открываем порт для Vite dev server
EXPOSE 5173

# Запускаем dev server
CMD ["npm", "run", "dev", "--", "--host"]