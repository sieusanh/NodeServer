import { Request, Response } from 'express';
import log from 'log';
import config from '../config.json';
import pgService from '../database/postgres';
import PushNotifier from '../services/push-notification';
const logger = log.get('controller-monitor');

// Admin controllers
async function pushNotify(req: Request, res: Response) {
    try {
        logger.info(`count`)
        const emails = req.query.emails as string;

        const sendResult = await PushNotifier(emails);
        console.log('sendd: ', sendResult)

        res.status(200).json({ message: 'Send notify successfully.' });
    } catch (err) {
        logger.info(`count`);
        res.status(500).json(err);
    }
}

async function downloadFile(req: Request, res: Response) {
    try {
        logger.info(`count`)
        const params = req.query;

        res.status(200).json({ data: '' });
    } catch (err) {
        logger.info(`count`);
        res.status(500).json(err);
    }
}

export default {
    pushNotify, downloadFile
};
