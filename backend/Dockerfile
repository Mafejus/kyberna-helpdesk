FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

# Security: Run as non-root user
RUN chown -R node:node /usr/src/app
USER node

CMD ["npm", "run", "start:prod"]
