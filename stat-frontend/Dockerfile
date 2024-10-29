# Встановлення Node.js для побудови та запуску додатка
FROM node:18

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json і package-lock.json для встановлення залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код у контейнер
COPY . .

# Будуємо додаток
RUN npm run build

# Відкриваємо порт 3001 всередині контейнера
EXPOSE 3001

# Запускаємо Vite-сервер на порті 3001
CMD ["npm", "run", "preview", "--", "--port", "3001", "--host"]
