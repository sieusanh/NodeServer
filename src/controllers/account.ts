import { Request, Response } from 'express';
import log from 'log';
import redisClient from '../database/redis';
// import { operator } from '../data/operator';
import { countRecords, findRecords, deleteRecord } from '../data/query';
import { insertRow } from '../data/insert';
import pgService from '../database/postgres';
import accountModel from '../models/account';
const logger = log.get('controller-account');

async function register(req: Request, res: Response) {
    try {
        logger.info(`register`)
        const params = req.query;
        // let newAccount: accountModel;
        // newAccount = params;

        // Check if this account already existed
        let queryString: string = countRecords(params);
        const queryData = await pgService.operator(queryString, []);
        const {
            rows: [
                {
                    count: count_num = ''
                }
            ]
        } = queryData;
        const numAccount = parseInt(count_num) || 0;
        console.log({ numAccount })
        if (numAccount > 0) {
            res.status(403).json({
                message: 'Email or username already existed.'
            });
            return;
        }

        // Insert new account
        // const account = { ...params };
        // const account = accountModel(params);
        const account: accountModel = {
            name: '', age: 0, gender: '',
            phone: '', email: '', username: '',
            password: '', role: '', created_at: 0
        };
        for (const field in account) {
            account[field] = params[field];
        }
        account.created_at = account.created_at
            || new Date().getTime();
        account.role = account.role || 'user';

        queryString = insertRow(account);
        await pgService.operator(queryString, []);

        // Generate new access token

    } catch (err) {
        logger.info(`register`);
        res.status(500).json(err);
    }
}

// User

// Admin
// async function checkMongo(req: Request, res: Response) {
//     try {
//         await mongoService.connect();
//         console.log('okay')
//         await mongoService.close();
//         const timestamp = new Date().getTime();
//         console.log('timestamp: ', timestamp);
//         res.status(200).json({
//             message: 'Success'
//         });
//     } catch (err) {
//         console.log('Loi: ', err)
//         res.status(500).json({ message: 'Loi roi' })
//     }
// }

async function count(req: Request, res: Response) {
    try {
        logger.info(`count`)
        const params = req.query;
        let queryString: string = countRecords(params);

        const queryData = await pgService.operator(queryString, []);
        const {
            rows: [
                {
                    count: count_num = ''
                }
            ]
        } = queryData;

        const data = parseInt(count_num) || 0;
        res.status(200).json({ data });
    } catch (err) {
        logger.info(`count`);
        res.status(500).json(err);
    }
}

async function find(req: Request, res: Response) {
    try {
        logger.info(`find`)
        const params = req.query;
        let queryString: string = findRecords(params);
        const queryData = await pgService.operator(queryString, []);
        const {
            rowCount: total = 0,
            rows: data = []
        } = queryData;
        res.status(200).json({
            total,
            data
        });
    } catch (err) {
        logger.info(`find`);
        res.status(500).json(err);
    }
}

async function deleteOne(req: Request, res: Response) {
    try {
        logger.info(`find`)
        const id = req.params.id || '';
        let queryString: string = deleteRecord(1);
        const queryData = await pgService.operator(
            queryString, [id]);
        const { rowCount: total = 0 } = queryData;
        if (total != 1) {
            // throw Error('Not found record');
            throw 'Not found record';
        }
        res.status(204).json({
            total
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

async function checkRedis(req: Request, res: Response) {
    try {

        // Redis
        // Gia su so luong tồn kho hien tai la con 10
        const slTonKho = 10;

        // tn cua san pham la iPhone13
        const keyName = 'iPhone13';

        // Gia su moi lan mua thi luong tieu thu hang ton kho la 1
        const slMua = 1;

        // So luong da ban ra, neu chua ban thi set = 0, 
        // con neu ban thi update + 1 moi lan user order thanh cong!
        // const getKey = await redisClient.get(keyName);
        const getKey = await redisClient.exists(keyName);
        // Check if keyName existed
        if (!getKey) {
            await redisClient.set(keyName, 0, {
                NX: true
            });
        }

        // Lay so luong ban ra
        let slBanRa = await redisClient.get(keyName);
        console.log(`Truoc khi user order thanh cong 
        thi so luong ban ra == `, slBanRa);

        // Neu so luong ban ra + so luong mua (slMua) > slTonKho
        // return failed
        // if (+slBanRa + slMua > slTonKho) {
        slBanRa = await redisClient.incr(keyName, slMua)
        if (+slBanRa > slTonKho) {
            console.log('HET HANG');
            slBanRa = await redisClient.decr(keyName, slMua)
            return res.json({
                msg: 'Het hang'
            });
        }

        // Neu user order thanh cong
        // await redisClient.set(keyName, +slBanRa + slMua);
        // slBanRa = await redisClient.get(keyName);

        // slBanRa = await redisClient.incr(keyName, slMua)
        console.log(`Sau khi user order thanh cong 
        thi so luong ban ra == `, slBanRa);
        console.log('=====================')
        console.log()
        if (slBanRa > slTonKho) {
            await redisClient.set('banquaroi', slBanRa - slTonKho)
        }

        // await redisClient.del(keyName);

        // await redisClient.set('prop1', 'val1');
        // const value = await redisClient.get('prop2');
        // console.log({ value })

        // 17'
        // autocannon -a 40 -c 20 -d 10 -m POST http://localhost:9000/order/commit

        res.status(200).json({
            message: 'Success'
        });
    } catch (err) {
        console.log('Loi: ', err)
        res.status(500).json({ message: 'Loi roi' })
    }
}

// Admin


export default {
    register, count, find, deleteOne, checkRedis
};
