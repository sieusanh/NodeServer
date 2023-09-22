import axios from 'axios';
import log from 'log';
import pgService from '../database/postgres';
import mongoService from '../database/mongo';
import table from './table';
import config from '../config.json';
import { insertRow } from './insert';

import Account from '../models/account';
const logger = log.get('data-generator');

async function createTable(queryString: string) {
    try {
        const client = await pgService.connect();
        const res = await client.query(queryString);
        console.log('RES: ', res)
        logger.info('Create table successfully.');
        await client.release();
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

    const client = await pgService.connect();

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
    let queryString: string;
    let promises: Promise<any>[] = [];

    for (const e of accounts) {
        for (const field in account) {
            if (field === 'name') {
                account.name = e.firstName;
            } else if (field === 'role') {
                account.role = e.role || 'user';
            } else {
                account[field] = e[field]
            }

            // account[field] = e[field];
        }
        // account.name = e.firstName || '';
        // account.role = account.role || 'user';

        account.created_at = new Date().getTime();
        queryString = insertRow(account);
        // const inserted_promise = operator(
        // queryString, [], 'create');
        const inserted_promise = client.query(
            queryString, Object.values(account).map(e => e))
            .then((res: any) => res)
            .catch((err: Error) => err);
        promises.push(inserted_promise);
    }

    await Promise.all(promises);
    await client.release();
}


function generateData() {

    // createTable(ob.alter_accounts);
    // createTable(ob.accounts);
    // populateAccountData();
    const mgDBname = config.MONGO.DATABASE;
    const collectionName = 'orders';
    // createCollection(mgDBname, collectionName);
}

export default generateData;