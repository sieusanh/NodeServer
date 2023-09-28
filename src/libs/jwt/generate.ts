import jwt from 'jsonwebtoken';
import config from '../../config.json';

function genToken(payload: any) {
	const privateKey: string = config.JWT.PRIVATE_KEY;
	const expiredTime: string = config.JWT.EXPIRE_TIME;

	const token: string = jwt.sign(
		payload,
		privateKey,
		{ algorithm: 'HS256', expiresIn: expiredTime }
	);

	return token;
}

export default genToken;