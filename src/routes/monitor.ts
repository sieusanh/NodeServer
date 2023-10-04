import { Router } from 'express';
import monitorControllers from '../controllers/monitor';
import middlewares from '../middlewares';

const router = Router();
const { pushNotify, downloadFile } = monitorControllers;
const { userAuthentication,
    adminAuthorization } = middlewares;


// Admin
router.post('/push-notify', pushNotify);
router.post('/download-file', downloadFile);


export default router;
