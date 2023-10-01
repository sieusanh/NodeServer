import bcrypt from 'bcrypt';
import { app, express } from './http-server';

function routeBcrypt() {
    app.get('/bcrypt', async (req: express.Request,
        res: express.Response) => {
        const hashedPassword = await bcrypt.hash('This is a password', 10);
        res.send(hashedPassword);
    });
}
export default routeBcrypt;