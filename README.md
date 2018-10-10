# node-webapp-sample
Experimental starter pack for Node.JS webapps

## TODO
1. Testing graphql resolvers with context
1. Rate limit login
1. Redis session store / cache
1. Database seeds
1. Add Graphql sanity limits (DoS)
1. File uploads
1. Websockets
1. Dockerfile
1. Production config (ts-node transpile-only mode, NODE_ENV == 'production', ...)
1. Helm package
1. TSLint, tslint-config-prettier ?
1. Global error handler

# Migrations
## Create migrations

    npm run typeorm -- migration:generate -n Initial

## Run migrations

    npm run typeorm -- migration:run
