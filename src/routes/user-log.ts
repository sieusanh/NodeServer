import { Router } from 'express';
import userLogControllers from '../controllers/user-log';
import middlewares from '../middlewares';

const router = Router();
const { count, find } = userLogControllers;
const { userAuthentication,
    adminAuthorization } = middlewares;

// Common
// User

// Admin
// router.get('/count', userAuthentication,
//     adminAuthorization, count);
// router.get('/find', userAuthentication,
//     adminAuthorization, find);

router.get('/count', count);
router.get('/find', find);


export default router;
