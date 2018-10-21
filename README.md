# node-webapp-sample

Experimental starter pack for Node.JS webapps

## TODO

1. Full text search
1. File uploads (GraphQL and not)
1. GraphQL subscriptions
1. socket.io auth (https://github.com/auth0/node-jsonwebtoken)
1. GraphQL resolver middleware rate limit (https://github.com/microlinkhq/async-ratelimiter) (https://github.com/prisma/graphql-middleware)
1. GraphQL shield (https://github.com/maticzav/graphql-shield)

# Migrations

## Create migrations

    npm run typeorm -- migration:generate -n Initial

## Run migrations

    npm run typeorm -- migration:run

### Postgres extensions needed

1. uuid-ossp
1. unaccent
1. pg_trgm

# Helm package

    noder/

# Features

- Dialect: Typescript [Link](https://www.typescriptlang.org/)
- Server: Koa [Link](https://koajs.com/)
- ORM: TypeORM [Link](http://typeorm.io/)
- GraphQL: Apollo [Link](https://www.apollographql.com/)
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
- Flash messages
- Production deployment config suited for Kubernetes
- Dockerfile
- Helm package (noder)

# Dependencies

- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)

# Full text search WIP

*Field type*: django.contrib.postgres.search.SearchVectorField, tsvector

*Index type*: django.contrib.postgres.indexes.GinIndex

*Update vector*: search_vector = SearchVector('title', weight='A', config='pt') + SearchVector('description', weight='B', config='pt')

*trigger*: Use a trigger to update search vector

Example: https://mathisonian.com/writing/postgres-full-text-search-with-sequelizejs

## Migration

+UnaccentExtension

### UP
    CREATE TEXT SEARCH CONFIGURATION pt ( COPY = portuguese );
    ALTER TEXT SEARCH CONFIGURATION pt
            ALTER MAPPING FOR hword, hword_part, word
            WITH unaccent, portuguese_stem;

### DOWN
    DROP TEXT SEARCH CONFIGURATION pt;
