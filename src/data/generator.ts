import axios from 'axios';
import log from 'log';
import dbService from '../database/postgres';
import mongoService from '../database/mongo';
import tables from './table';
import config from '../config.json';

import Account from '../models/account';
const logger = log.get('data-generator');

async function createTable(queryString: string) {
    try {
        const res = await dbService.client.operator(queryString, []);
        console.log('RES: ', res)
        logger.info('Create table successfully.');
    } catch (err) {
        logger.info(JSON.stringify(err));
    }
}

async function createCollection(dbName: string, collectionName: string) {
    try {
        await mongoService.connect();
        const db = mongoService.client.db(dbName);
        await db.createCollection(collectionName);
        await mongoService.close();
        console.log('created collection ', collectionName)
    } catch (err) {
        console.log('Loi ne: ', err)
        logger.info(JSON.stringify(err));
    }
}

// Populating data
async function populateAccountData() {
    // https://dummyjson.com/users?limit=100

    // Retrieving product data
    const url: string = "https://dummyjson.com/users?limit=100";
    const res = await axios.get(url);
    const accounts = res.data.users;

    const account: Account = {
        name: '',
        age: 0,
        gender: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        role: '',
        created_at: 0
    };
    const promises: Promise<any>[] = [];
    const tableName = config?.TABLE?.ACCOUNT || 'accounts';

    for (const e of accounts) {
        for (const field in account) {
            if (field === 'name') {
                account.name = e.firstName;
            } else if (field === 'role') {
                account.role = e.role || 'user';
            } else {
                account[field] = e[field]
            }
        }
        account.created_at = new Date().getTime();
        const insertedPromise = dbService.create(tableName, account)
            .then((res: any) => res)
            .catch((err: Error) => err);

        promises.push(insertedPromise);
    }

    await Promise.all(promises);
}


function generateData() {

    const { accounts } = tables;

    // Postgres
    // createTable(ob.alter_accounts);
    // createTable(accounts);
    // populateAccountData();

    // Mongodb
    // const mgDBname = config.MONGO.DATABASE;
    // const collectionName = 'orders';
    // createCollection(mgDBname, collectionName);
}

export default generateData;