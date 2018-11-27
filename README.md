# node-webapp-sample

Experimental starter pack for Node.JS webapps

## TODO

1. Experiment moving from TypeORM to [Objection.js](http://vincit.github.io/objection.js/)
1. GraphQL resolver middleware rate limit (https://github.com/microlinkhq/async-ratelimiter) (https://github.com/prisma/graphql-middleware)
1. GraphQL shield (https://github.com/maticzav/graphql-shield)

## Migrations

### Create migrations

    npm run typeorm -- migration:generate -n Initial

### Run migrations

    npm run typeorm -- migration:run

#### Postgres extensions needed

1. uuid-ossp
1. unaccent
1. pg_trgm

## Helm package

    noder/

## Features

- Dialect: Typescript [Link](https://www.typescriptlang.org/)
- Server: Koa [Link](https://koajs.com/)
- ORM: TypeORM [Link](http://typeorm.io/)
- GraphQL: Apollo [Link](https://www.apollographql.com/)
- GraphQL: Uploads [Link](https://github.com/jaydenseric/graphql-upload)
- OAuth provider [Link](https://github.com/oauthjs/node-oauth2-server)
- HTML templating: Nunjucks [Link](https://mozilla.github.io/nunjucks/)
- HTTP Sessions [Link](https://github.com/koajs/session)
- Tests: Jest [Link](https://jestjs.io/)
- Authentication: Passport [Link](http://www.passportjs.org/)
- Structured logging: Winston [Link](https://github.com/winstonjs/winston)
- Tracing: AsyncHooks [Link](https://nodejs.org/api/async_hooks.html)
- Exception reporting: Sentry [Link](https://sentry.io/)
- i18n [Link](https://github.com/koa-modules/i18n)
- Rate limiting [Link](https://github.com/koajs/ratelimit)
- Security: [CSRF](https://github.com/koajs/csrf), [CORS](https://github.com/koajs/cors), etc
- Linting: [TSLint](https://palantir.github.io/tslint/), [prettier](https://prettier.io/)
- Websockets: socket.io [Link](https://socket.io/)
- Multipart uploads: async-busboy [Link](https://github.com/m4nuC/async-busboy)
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

- `npm start`: Start application in development mode.
- `npm test`: Run tests.
- `npm run build`: Compile Typescript code and generate production build in `dist/`.
- `npm run lint`: Run TSLint on all the code.
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

- Unresponsive Postgresql server can cause requests to stall
  - https://github.com/brianc/node-postgres/pull/1760
- Unresponsive Redis server can cause requests to stall
  - https://github.com/luin/ioredis/pull/658
  - https://github.com/luin/ioredis/pull/241
