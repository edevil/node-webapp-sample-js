# node-webapp-sample
Experimental starter pack for Node.JS webapps

## TODO
1. Add Graphql sanity limits (DoS)
1. Helm package
1. File uploads
1. Websockets
1. TSLint, tslint-config-prettier ?
1. Global error handler
1. camelCase <-> snake_case

# Migrations
## Create migrations

    npm run typeorm -- migration:generate -n Initial

## Run migrations

    npm run typeorm -- migration:run
