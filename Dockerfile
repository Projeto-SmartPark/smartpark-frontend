FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Servir build estático
RUN npm install -g serve

EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]
