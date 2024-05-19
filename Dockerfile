FROM node:20


WORKDIR /app

ENV ORIGIN http://tablero.apriego.dawmor.cloud:3000

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm run migration:generate && npm run migration:push

RUN npm prune --production

ENV PORT 3000

EXPOSE 3000

CMD ["node", "build"]