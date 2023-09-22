import { MongoClient } from 'mongodb';
import { MONGO } from '../config.json'

class MongoService {
    readonly database: any
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

    async create(collectionName: string, data: Object) {
        const collection = this.database.collection(collectionName);
        await collection.insertOne(data);
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
