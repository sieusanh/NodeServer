import express from 'express';
import log from 'log';
import helmet from 'helmet';
import cors from 'cors';
import redisClient from '../database/redis';
import pgService from '../database/postgres';
import mgService from '../database/mongo';
import { PORT } from '../config.json';
import routes from '../routes';

const app = express();
let server;

function shutDown() {
    server.close(() => {
        // pgService.close();
        // redisClient.disconnect();
        // mgService.close();

        log.info('Closed out remaining connections');
    });
}

async function startServer() {
    // await pgService.connect();
    // await redisClient.connect();
    // await mgService.connect();

    const { json } = express;
    server = app.listen(PORT, () => {
        log.info(`SERVER IS LISTENING ON PORT ${PORT}`);
        console.log('Server has started.');
    });

    // Gentle shutdown
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);

    // Routing
    app.use(json());
    app.use(helmet());
    app.use(cors({
        origin: '*',
        methods: ['GET']
    }));

    for (const route in routes) {
        app.use(`/v1/api/${route}`, routes[route]);
    }
}

export { startServer, app, express, PORT };