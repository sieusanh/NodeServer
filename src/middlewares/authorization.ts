'use strict'
import { Response, NextFunction } from 'express';
import AuthInfoRequest
    from '../libs/interfaces/auth-request';

const adminAuthorization = (req: AuthInfoRequest,
    res: Response, next: NextFunction) => {

    if (req.account.role !== 'Admin') {
        res.status(403).json('Admin authorization failed.')
        return
    }

    next();
}

export default { adminAuthorization };
