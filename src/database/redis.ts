import log from 'log';
import { createClient } from 'redis';
import { REDIS } from '../config.json';

class RedisService {
    public client: any
    constructor() {
        const {
            HOST = '', PORT = 0
        } = REDIS;

        const url = `redis://${HOST}:${PORT}`;
        this.client = createClient({ url });
        this.client.on('error', (err: Error) => {
            log.info('Redis error: ', err);
        })
    }
}

const redisService = new RedisService();
export default redisService.client;