import { Request } from 'express';
import Account from '../../models/account';

interface AuthInfoRequest extends Request {
    account: Account
}

export default AuthInfoRequest;