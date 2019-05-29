FROM node:10.16 AS base

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]


FROM base AS build

WORKDIR /app
RUN npm run build


FROM node:10.16-alpine AS release

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/src ./src
COPY --from=build /app/static ./static
COPY knexfile.js ./
COPY views ./views
COPY locales ./locales

ENV NODE_ENV production
CMD ["node", "src/server.js"]
