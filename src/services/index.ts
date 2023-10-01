import { startServer } from './http-server';
import routeCompression from './compression';
import routeBcrypt from './bcrypt';
import routeCluster from './cluster';

export default {
    startServer, routeCompression,
    routeBcrypt, ...routeCluster
};
