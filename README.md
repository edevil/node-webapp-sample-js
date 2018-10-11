# node-webapp-sample
Experimental starter pack for Node.JS webapps

## TODO
1. Redis session store / cache
1. Database seeds
1. Add Graphql sanity limits (DoS)
1. File uploads
1. Websockets
1. Helm package
1. TSLint, tslint-config-prettier ?
1. Global error handler

# Migrations
## Create migrations

    npm run typeorm -- migration:generate -n Initial

## Run migrations

    npm run typeorm -- migration:run
