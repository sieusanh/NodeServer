import { MongoClient } from 'mongodb';
import { MONGO } from '../config.json'
import RequestParams from '../libs/interfaces/request-params';

class MongoService {
    public database: any
    public client: MongoClient
    constructor() {
        const {
            HOST = '',
            PORT = 0,
            DATABASE = '',
            USERNAME = '',
            PASSWORD = ''
        } = MONGO;
        // url = mongodb://[username]:[password]@[host]:[port]/[database]
        const url = `mongodb://${HOST}:${PORT}`;
        this.client = new MongoClient(url);
        this.database = this.client.db(DATABASE);
    }

    create(table: string, params: Object) {
        const collection = this.database.collection(table);
        const promise = collection.insertOne(params);
        return promise;
    }

    count(table: string, params: Object) {
        const collection = this.database.collection(table);
        const promise = collection.countDocuments(params);
        return promise;
    }

    find(table: string, params: RequestParams) {
        const collection = this.database.collection(table);
        const { limit = 10, ...query } = params;

        const promise = collection.find(query, {
            projection: {
                _id: 0
            }
        }).limit(limit);

        return promise;
    }

    connect() {
        return this.client.connect();
    }

    close() {
        return this.client.close();
    }
}

const mgService = new MongoService();
export default mgService;
