import axios from 'axios';
import log from 'log';
import pgService from '../database/postgres';
import mgService from '../database/mongo';
import tables from './table';
import config from '../config.json';

import Account from '../models/account';
import UserLog from '../models/user-log';
const logger = log.get('data-generator');

async function createTable(queryString: string) {
    try {
        await pgService.client.operator(queryString, []);
        logger.info('Create table successfully.');
    } catch (err) {
        logger.info(JSON.stringify(err));
    }
}

async function createCollection(
    dbName: string, collectionName: string) {
    try {
        const db = mgService.client.db(dbName);
        await db.createCollection(collectionName);
        console.log('A new collection created.')
    } catch (err) {
        console.log('Loi gi v: ', err)
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
        createdAt: 0
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
        account.createdAt = new Date().getTime();
        const insertedPromise = pgService.create(tableName, account)
            .then((res: any) => res)
            .catch((err: Error) => err);

        promises.push(insertedPromise);
    }

    await Promise.all(promises);
}

// Utilities
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function populateLogData() {

    try {
        const promises: Promise<any>[] = [];
        const table = config?.TABLE?.USER_LOG || 'userLog';

        const loopLimit = 1000;
        const fromTime = new Date('2022-01-01T00:00:00.000Z')
            .getTime();
        const toTime = new Date('2023-01-01T00:00:00.000Z')
            .getTime();
        let randomLog = {};
        let userId: number;
        let userGender: string;
        let loginAt: number;
        let logoutAt: number;
        let activities: Object;
        let documentBatch: Object[];
        const logCollection = mgService.database.collection(table);

        console.time('timer')
        for (let l = 1; l <= 10; l++) {
            for (let i = 1; i <= loopLimit; i++) {
                documentBatch = [];
                for (let j = 1; j <= loopLimit; j++) {
                    // Generate random values
                    userId = getRandomInt(1, 1000);
                    userGender = (userId % 2) ? 'Male' : 'Female';
                    // 01/01/2022 - 01/01/2023
                    loginAt = getRandomInt(fromTime, toTime);
                    logoutAt = loginAt + 2 * 60 * 60 * 1000; // +2h
                    activities = {
                        getCount: getRandomInt(1, 50),
                        postCount: getRandomInt(1, 50)
                    };
                    randomLog = {
                        userId, userGender,
                        loginAt, logoutAt, activities
                    };
                    documentBatch.push(randomLog);
                }

                const insertedPromise = logCollection
                    .insertMany(documentBatch)
                    .then((res: any) => res)
                    .catch((err: Error) => err);

                promises.push(insertedPromise);
            }

            await Promise.all(promises);
        }
        console.timeEnd('timer')

    } catch (err) {
        console.log('Loi roi: ', err)
    }
}

function generateData() {

    const { accounts } = tables;

    // Postgres
    // createTable(ob.alter_accounts);
    // createTable(accounts);
    // populateAccountData();

    // Mongodb
    // const mgDatabase = config.MONGO.DATABASE;
    // const table = config.TABLE.USER_LOG;
    // createCollection(mgDatabase, table);


    // populateLogData();
}

export default generateData;