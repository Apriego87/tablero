FROM node:20

WORKDIR /app

ENV ORIGIN=http://tablero.apriego.dawmor.cloud:3000

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

ENV PORT=3000

EXPOSE 3000

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["node", "build"]
