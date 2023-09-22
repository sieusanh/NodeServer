import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import method_mapping from '../libs/mapping/rest-method';

const router = Router();
const { Account } = controllers;

const { userAuthentication, adminAuthorization } = middlewares;

function routeNameFormatter<T>(router: Router, controller: any): Router {

    for (const name in controller) {
        // Mapping REST METHODS
        const method = method_mapping[name];

        if (name === 'checkRedis') {
            router[method](`/${name}`, controller[name]);
            return router;
        }

        // Routing to the specified method names
        router[method](`/${name}`,
            userAuthentication, adminAuthorization, controller[name]);

    }

    return router;
}

const accountRoute = routeNameFormatter(router, Account);

export default {
    account: accountRoute
};
