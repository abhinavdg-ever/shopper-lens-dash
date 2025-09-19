FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Run Vite preview server
EXPOSE 5173
CMD ["npm", "start"]
