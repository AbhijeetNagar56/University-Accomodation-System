FROM node:22-alpine

WORKDIR /app

# Copy package files first for cache
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend-server/package*.json ./backend-server/

# Install root deps
RUN npm install

# Copy source
COPY . .

# Build frontend
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]