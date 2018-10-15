# node-webapp-sample

Experimental starter pack for Node.JS webapps

## TODO

1. CD Cloud Build script `helm upgrade noder --namespace noder-develop noder --timeout 60 --set image.tag=master_64043b960381a66740d9199ebf81c649d40e0797`
1. Include linter in CI
1. Redo request logger
1. Show ip in request logs
1. Accept X- headers (app.proxy = true)
1. stackdriver-friendly http context in request logs
1. File uploads
1. Websockets
1. Global error handler (Sentry)

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
