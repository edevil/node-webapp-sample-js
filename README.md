# node-webapp-sample

Experimental starter pack for Node.JS webapps

## TODO

1. File uploads
1. Websockets
1. Global error handler (Sentry)
1. OAuth provider

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
