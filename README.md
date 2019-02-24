# node-webapp-sample

Experimental starter pack for Node.JS webapps, in Javascript. [TypeScript version](https://github.com/edevil/node-webapp-sample)

[![CircleCI](https://circleci.com/gh/edevil/node-webapp-sample-js.svg?style=svg)](https://circleci.com/gh/edevil/node-webapp-sample-js)
[![Build Status](https://travis-ci.org/edevil/node-webapp-sample-js.svg?branch=master)](https://travis-ci.org/edevil/node-webapp-sample-js)

## TODO

1. GraphQL resolver middleware rate limit (https://github.com/microlinkhq/async-ratelimiter) (https://github.com/prisma/graphql-middleware)
1. GraphQL shield (https://github.com/maticzav/graphql-shield)

## Migrations

### Create migrations

    npm run knex -- migrate:make Initial

### Run migrations

    npm run knex -- migrate:latest

#### Postgres extensions needed

1. uuid-ossp
1. unaccent
1. pg_trgm

## Helm package

    noder/

## Features

- Server: [Koa](https://koajs.com/)
- ORM: [Objection.js](http://vincit.github.io/objection.js/)
- GraphQL: [Apollo](https://www.apollographql.com/)
- OAuth provider: [node-oauth2-server](https://github.com/oauthjs/node-oauth2-server)
- HTML templating: [Nunjucks](https://mozilla.github.io/nunjucks/)
- HTTP Sessions: [koa-session](https://github.com/koajs/session)
- Tests: [Jest](https://jestjs.io/)
- Authentication: [Passport](http://www.passportjs.org/)
- Structured logging: [Winston](https://github.com/winstonjs/winston)
- Tracing: [AsyncHooks](https://nodejs.org/api/async_hooks.html)
- Exception reporting: [Sentry](https://sentry.io/)
- i18n: [koa-i18n](https://github.com/koa-modules/i18n)
- Object validation: [Joi](https://github.com/hapijs/joi)
- Rate limiting: [koa-ratelimit](https://github.com/koajs/ratelimit)
- Security: [CSRF](https://github.com/koajs/csrf), [CORS](https://github.com/koajs/cors), etc
- Linting: [ESLint](https://eslint.org/), [prettier](https://prettier.io/)
- Websockets: [socket.io](https://socket.io/)
- Multipart uploads: [async-busboy](https://github.com/m4nuC/async-busboy)
- Full text search
- Flash messages
- Production deployment config suited for Kubernetes
- Dockerfile
- Helm package (noder)

## Dependencies

- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Node.js](https://nodejs.org/) >= 10

## Quickstart

### PostgreSQL

```bash
docker run -d --name=database -p 5432:5432 -e POSTGRES_DB=sample_db postgres
```

### Redis

```bash
docker run -d -p 6379:6379 --name shared_redis redis
```

### NPM dependencies

```bash
npm install
```

### Config variables

- `APP_KEYS`: JSON array of strings that is used as secrets for various functions. Make sure this is initialized with random secret data.
- `BASE_URL`: Base URL that is used to build absolute URLs pointing to this application. Default: "http://example.com:3000"
- `DB_HOST`: Hostname of the database. Default: "localhost"
- `DB_NAME`: Name of the database (needs to exist). Default: "sample_db"
- `DB_PASSWORD`: Password to connect to database: Default: ""
- `DB_USER`: Username to connect to database: Default: "postgres"
- `GOOGLE_CLIENT_ID`: Google client ID for Google authentication.
- `GOOGLE_CLIENT_SECRET`: Google client secret for Google authentication.
- `GQL_DEPTH_LIMIT`: Depth limit for GraphQL queries. Default: "5"
- `GQL_MAX_PER_PAGE`: Max items per page on GraphQL queries. Default: "100"
- `GQL_PATH`: Path on where to mount GraphQL handler. Default: "/graphql"
- `LOG_SQL`: Log all SQL queries. Default: "true"
- `ORIGINS`: JSON array of allowed request origins. Default: "http://localhost:3000", "http://example.com:3000"
- `PORT`: Post to listen on. Default: "3000"
- `RAVEN_DSN`: DSN to use for reporting exceptions.
- `REDIS_HOST`: Hostname of the Redis server. Default: "localhost"
- `REDIS_PREFIX`: Redis prefix to use. Default: "sample-node"
- `SHOW_PLAYGROUND`: Show GraphQL playground. Default: "true"
- `TRUST_X_HEADERS`: Trust proxy headers. Default: "false"

The dotenv module is used so a `.env` file can be placed on the root of the project with values for these enviroment variables.

### Run application

```bash
npm start
```

## Available commands

- `npm run dev`: Start backend and webpack in development mode.
- `npm test`: Run tests.
- `npm start`: Start backend application in development mode.
- `npm run lint`: Run linter on all the code.
- `npm run pretty`: Check all the code against `prettier`'s standards.

## GraphQL examples

### Subscribe for new cards

```GraphQL
subscription {
  cardAdded {
    title
  }
}
```

### Add new card

```GraphQL
mutation {
  createCard(card:{title:"Title", description:"Description"}) {
    id
  }
}
```

### List cards

```GraphQL
{
  cards {
    id
    title
  }
}
```

## Known issues

- Unresponsive Redis server can cause requests to stall
  - https://github.com/luin/ioredis/pull/658
  - https://github.com/luin/ioredis/pull/241
