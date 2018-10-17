# node-webapp-sample

Experimental starter pack for Node.JS webapps

## TODO

1. File uploads (GraphQL and not)
1. GraphQL subscriptions
1. Websockets (socket.io)
1. OAuth provider
1. Documentation

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
