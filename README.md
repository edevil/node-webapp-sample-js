# node-webapp-sample

Experimental starter pack for Node.JS webapps

## TODO

1. Helm package
1. CD Cloud Build script
1. Accept X- headers (app.proxy = true)
1. JSON logging in production
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

# Helm package

    noder/
