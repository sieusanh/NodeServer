import { Request } from 'express';
import AccessInfo from '../../models/access-info';

interface AuthInfoRequest extends Request {
    info: AccessInfo
}

export default AuthInfoRequest;