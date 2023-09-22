import { Client } from 'pg';
import { POSTGRES } from '../config.json'

class PgService {
    public client: any
    constructor() {
        const {
            HOST = '', PORT = 0, DATABASE = '',
            USERNAME = '', PASSWORD = ''
        } = POSTGRES;

        this.client = new Client({
            host: HOST,
            port: PORT,
            database: DATABASE,
            user: USERNAME,
            password: PASSWORD,
        });
    }

    connect() {
        return this.client.connect();
    }

    close() {
        return this.client.end();
    }

    async operator(queryString: string, values: string[]) {
        const data = await this.client.query(
            queryString, values);
        return data;
    }
}

const pgService = new PgService();
export default pgService;