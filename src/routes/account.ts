import { Router } from 'express';
import accountControllers from '../controllers/account';
import middlewares from '../middlewares';

const router = Router();
const { register, login, count, find,
    getCurrentInfo } = accountControllers;
const { userAuthentication,
    adminAuthorization } = middlewares;

// Common
router.post('/register', register);
router.post('/login', login);

// User
router.get('/info', userAuthentication,
    getCurrentInfo);

// Admin
router.get('/count', userAuthentication,
    adminAuthorization, count);
router.get('/find', userAuthentication,
    adminAuthorization, find);

export default router;
