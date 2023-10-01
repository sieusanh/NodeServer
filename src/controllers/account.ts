import { Request, Response } from 'express';
import log from 'log';
import bcrypt from 'bcrypt';
import redisClient from '../database/redis';
import config from '../config.json';
import pgService from '../database/postgres';
import accountModel from '../models/account';
import genToken from '../libs/jwt/generate';
const logger = log.get('controller-account');

// Common controllers
async function register(req: Request, res: Response) {
    try {
        logger.info(`register`)
        const params = req.body;

        // Check if this account already existed
        const tableName = config?.TABLE?.ACCOUNT || 'accounts';
        const queryData = await pgService.count(tableName, {
            username: params?.username || '',
            password: params?.password || ''
        });
        const {
            rows: [
                {
                    count: count_num = ''
                }
            ]
        } = queryData;
        const numAccount = parseInt(count_num) || 0;
        if (numAccount > 0) {
            res.status(403).json({
                message: 'Email or username already existed.'
            });
            return;
        }

        // Insert new account
        const account: accountModel = {
            name: '', age: 0, gender: '',
            phone: '', email: '', username: '',
            password: '', role: '', createdAt: 0
        };
        for (const field in account) {
            account[field] = params[field];
        }
        account.createdAt = account.createdAt
            || new Date().getTime();
        account.role = account.role || 'user';

        // Encrypting password
        // const hashedPassword = await bcrypt.hash(
        //     account.password, 8);
        const hashedPassword = await bcrypt.genSalt();
        account.password = hashedPassword;
        await pgService.create(tableName, account);

        // Generate new access token
        const token = genToken({
            email: account?.email || '',
            name: account?.name || '',
            username: account?.username || '',
            role: account?.role || ''
        });

        res.status(200).json({ token });

    } catch (err) {
        logger.info(`register`);
        res.status(500).json(err);
    }
}

async function login(req: Request, res: Response) {
    try {
        logger.info(`login`)
        const params = req.body;

        // Check if this account already existed
        const tableName = config?.TABLE?.ACCOUNT || 'accounts';
        const queryData = await pgService.find(tableName, {
            username: params?.username || '',
            email: params?.email || ''
        });
        const {
            rows = []
        } = queryData;

        const accountInfo = rows[0] || {};
        const { email = '', username = '',
            role = '', password = '' } = accountInfo;
        const authenPassword = await bcrypt.compare(
            params.password, password)

        if (rows.length == 0 || !authenPassword) {
            res.status(404).json({
                message: 'Incorrect username or password.'
            });
            return;
        }

        // Generate new access token
        const token = genToken({
            email, username, role
        });

        res.status(200).json({ token });

    } catch (err) {
        logger.info(`login`);
        res.status(500).json(err);
    }
}

// User controllers
function getCurrentInfo(req: Request, res: Response) {
    try {
        logger.info(`current-info`)

        // Current info
        res.status(200);
        res.end();

    } catch (err) {
        logger.info(`current-info`);
        res.status(500).json(err);
    }
}


// Admin controllers
async function count(req: Request, res: Response) {
    try {
        logger.info(`count`)
        const params = req.query;

        const tableName = config?.TABLE?.ACCOUNT || 'accounts';
        const queryData = await pgService.count(tableName, params);
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
        const tableName = config?.TABLE?.ACCOUNT || 'accounts';
        const queryData = await pgService.find(tableName, params);
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

// delete 
async function deleteOne(req: Request, res: Response) {
    try {
        logger.info(`find`)
        const id = req.params.id || '';
        const tableName = config?.TABLE?.ACCOUNT || 'accounts';
        const queryData = await pgService.delete(
            tableName, { id });
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

// post
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
    register, login, count, find,
    deleteOne, checkRedis, getCurrentInfo
};
