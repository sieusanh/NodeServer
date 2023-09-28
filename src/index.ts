import express from 'express';
import log from 'log';
import helmet from 'helmet';
import cors from 'cors';
import redisClient from './database/redis';
import pgService from './database/postgres';
import { PORT } from './config.json';
import routes from './routes';
import generateData from './data/generator';

const app = express();
const { json } = express;

let server;

async function startServer() {
    await pgService.connect();
    // await redisClient.connect();

    server = app.listen(PORT, () => {
        log.info(`SERVER IS LISTENING ON PORT ${PORT}`);
        generateData();
        console.log('Server has started.')
    });
}

startServer();

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    server.close(() => {
        pgService.close();
        // redisClient.disconnect();
        log.info('Closed out remaining connections');
    });
}

app.use(json());
app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET']
}));

for (const route in routes) {
    app.use(`/v1/api/${route}`, routes[route]);
}

