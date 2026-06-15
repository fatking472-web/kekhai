FROM node:22-alpine

WORKDIR /app

COPY package.json ./

# Cài đặt dependencies (bao gồm speakeasy và qrcode cho 2FA)
RUN npm install --omit=dev

COPY server.js ./
COPY public ./public
COPY data/.gitkeep ./data/.gitkeep

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
