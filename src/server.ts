import * as Koa from 'koa';
import * as logger from 'koa-logger';
import { databaseInitializer } from 'initializers/database';
import { graphqlInitializer } from 'initializers/graphql';
import { routes } from 'routes';

const bootstrap = async () => {
    await databaseInitializer();

    const app = new Koa();

    app
        .use(logger())
        .use(routes.routes())
        .use(routes.allowedMethods())

    graphqlInitializer(app);
    app.listen(3000);
};

bootstrap();
