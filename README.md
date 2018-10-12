# node-webapp-sample
Experimental starter pack for Node.JS webapps

## TODO
1. Add Graphql sanity limits (DoS)
1. Add Graphql query that exercises recursion
1. Helm package
1. File uploads
1. Websockets
1. TSLint, tslint-config-prettier ?
1. Global error handler

# Migrations
## Create migrations

    npm run typeorm -- migration:generate -n Initial

## Run migrations

    npm run typeorm -- migration:run
