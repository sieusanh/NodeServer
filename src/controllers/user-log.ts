import { Request, Response } from 'express';
import validateParams from '../libs/helper/validateParams';
// import UserLogParams from '../models/user-log-params';
import UserLogParams from '../libs/interfaces/user-log-params';
import log from 'log';
import redisClient from '../database/redis';
import config from '../config.json';
import mgService from '../database/mongo';
const logger = log.get('controller-user-log');

// Common controllers

// User controllers


// Admin controllers
async function count(req: Request, res: Response) {
    try {
        logger.info(`count`);
        const params = req.query || {};
        const tableName = config?.TABLE?.USER_LOG || 'user-logs';
        const queryData = await mgService.count(tableName, params);

        const data = queryData || 0;
        res.status(200).json({ data });
    } catch (err) {
        logger.info(`count`);
        res.status(500).json(err);
    }
}

async function find(req: Request<{}, {}, {}, UserLogParams>, res: Response) {
    try {
        logger.info(`find`)
        const timeStart = new Date().getTime();
        const params = req.query;
        // Validate and normalize request params
        const paramPattern: UserLogParams = {
            userId: 0, userGender: '',
            loginFrom: 0, loginTo: 0,
            getCount: 0, postCount: 0, limit: 0
        }
        const { params: validParams, errMessage } = validateParams(paramPattern, params);
        if (errMessage) {
            throw new Error(errMessage)
        }

        // Caching using key by hashed params object and
        // value by JSON string of object list
        const cachedKey = Buffer.from(
            JSON.stringify(validParams), 'utf8').toString('base64');

        const redisValue = await redisClient.get(cachedKey);
        if (redisValue) {
            const cachedValue = JSON.parse(redisValue);
            const timeEnd = new Date().getTime();
            res.status(200).json({
                timer: timeEnd - timeStart,
                total: cachedValue.length,
                data: cachedValue
            });
            return;
        }

        // Request database server
        const tableName = config?.TABLE?.USER_LOG || 'user-logs';
        const queryData = await mgService.find(tableName, validParams).toArray();

        const cachedValue = JSON.stringify(queryData);
        await redisClient.set(cachedKey, cachedValue, {
            NX: true
        });

        const timeEnd = new Date().getTime();

        res.status(200).json({
            timer: timeEnd - timeStart,
            total: queryData.length,
            data: queryData
        });
    } catch (err) {
        console.log('Loi roi: ', err)
        logger.info(`find`);
        res.status(500).json({ error: err });
    }
}

// Admin


export default {
    count, find
};
