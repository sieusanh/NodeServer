import compression from 'compression';
import { app, express } from './http-server';

// COMPRESSION CASE
function routeCompression() {
    app.use(compression({
        level: 6,
        threshold: 100 * 1000, // 100 KB
        filter: (req, res) => {
            if (req.headers['x-no-compress']) {
                return false;
            }
            return compression.filter(req, res);
        }
    }));

    app.get('/compression', (req: express.Request,
        res: express.Response) => {
        const strCompress = "Hello ExpressJS";
        res.send(strCompress.repeat(10000));
    });
}

export default routeCompression;

// autocannon - a 40 - c 20 - d 10 - m POST http://localhost:9000/v1/api/compression  