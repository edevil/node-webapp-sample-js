# node-webapp-sample
Experimental starter pack for Node.JS webapps

## TODO
1. Social login
1. Rate limit login
1. Redis session store / cache
1. Add authentication to GraphQL
1. Relations card -> user
1. Add flash messages
1. JWT
1. Database seeds
1. Add Graphql sanity limits (DoS)
1. File uploads
1. Websockets
1. i18n
1. Tests
1. https://github.com/godaddy/terminus
1. Dockerfile
1. Helm package
1. Dynamic configuration
1. TSLint, tslint-config-prettier ?
1. Global error handler

# Migrations
## Create migrations

    npm run typeorm -- migration:generate -n Initial

## Run migrations

    npm run typeorm -- migration:run
