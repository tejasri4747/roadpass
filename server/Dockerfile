# Dockerfile for RoadPass demo server
FROM node:18-alpine

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# copy source
COPY . .

# create uploads dir
RUN mkdir -p uploads

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
