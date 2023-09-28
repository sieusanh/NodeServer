'use strict'
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT } from '../config.json';
import AuthInfoRequest
    from '../libs/interfaces/auth-request';

const userAuthentication = async (req: AuthInfoRequest,
    res: Response, next: NextFunction) => {
    try {
        // Check if account authorized
        const author_header = req.headers?.authorization || '';
        let statusCode: number, message: string;
        const splitted = author_header.split(' ');
        if (!author_header || splitted.length != 2) {
            statusCode = 403; // Forbidden
            message = 'Unauthorized.';
            return res.status(statusCode).json({
                user: null, message
            })
        }

        // Verify access token
        const accessToken = splitted[1] || '';
        const privateKey = JWT.PRIVATE_KEY;
        jwt.verify(accessToken, privateKey, (err,
            decodedToken: jwt.JwtPayload) => {

            // Verify failed.
            if (err) {
                statusCode = 500; // Internal Server Error
                message = 'Access Token is not valid!';
                return res.status(500).json({
                    user: null, message
                });
            }

            // Verify passed.
            const { username = '', email = '',
                name = '', role = '' } = decodedToken;
            req.info = { username, email, name, role };

            next();
        })

    } catch (err) {
        return res.status(403).json({
            user: null, message: 'Invalid access token.'
        });
    }
}

export default { userAuthentication };
