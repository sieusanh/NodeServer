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

    // accounts
    create(table: string, params: {}) {
        let i: number = 1;
        let indices: string = '';

        const fields = `${Object.keys(params).map(e => {
            indices += `$${i},`;
            i++;
            return e;
        })}`;

        const queryString = `INSERT INTO ${table} (${fields}) 
            VALUES(${indices.slice(0, indices.length - 1)})`;
        const values = Object.values(params).map(e => e);

        const promise = this.client.query(queryString, values);
        return promise;
    }

    // Common filter
    genFilterString(params: {}): string {

        if (Object.keys(params).length == 0) {
            return '';
        }

        const copyParams = { ...params };
        const objects = Object.entries(copyParams);
        let filterString = `${objects[0][0]} = '${objects[0][1]}' `;

        if (objects.length > 1) {
            // Remove the first element
            objects.splice(0, 1);

            for (const [key, value] of objects) {
                filterString += `AND ${key} = '${value}' `;
            }
        }

        return filterString;
    }

    count(table: string, params: {}) {
        const filterString = this.genFilterString(params);
        const queryString = `
            SELECT COUNT(id) 
            FROM ${table} 
            WHERE ${filterString}
        `;

        const promise = this.client.query(queryString, []);
        return promise;
    }

    find(table: string, params: {}) {
        const filterString = this.genFilterString(params);
        const queryString = `
            SELECT * 
            FROM ${table} 
            WHERE ${filterString}
            ORDER BY id ASC
        `;

        const promise = this.client.query(queryString, []);
        return promise;
    }


    update() { }

    // params = { id: number }
    delete(table: string, params: {}) {
        const filterString = this.genFilterString(params);
        const queryString = `
            DELETE FROM ${table} 
            WHERE ${filterString}
        `;

        const promise = this.client.query(queryString, []);
        return promise;
    }
}

const pgService = new PgService();
export default pgService;

