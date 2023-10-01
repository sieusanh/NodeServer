import os from 'os';
import cluster from 'cluster';
import { app, express, PORT } from './http-server';

function withCluster() {
    if (cluster.isPrimary) {
        const numCPU = os.cpus().length;
        console.log(`Forking ${numCPU} CPUs`);
        const workerSize = Math.floor(numCPU * 0.7);
        for (let i = 0; i < workerSize; i++) {
            cluster.fork();
        }
    } else {

        // Worker process
        const pid = process.pid;
        app.listen(PORT, () => {
            console.log('Server has started.');
        });
        app.get('/with-cluster', (req: express.Request,
            res: express.Response) => {
            // for (let i = 0; i < 2e6; i++) { }
            res.send(`Process ${pid} says hi`);
        });
    }
}

function withoutCluster() {

    // Worker process
    const pid = process.pid;
    app.listen(PORT, () => {
        console.log('Server has started.');
    });
    app.get('/without-cluster', (req: express.Request,
        res: express.Response) => {
        // for (let i = 0; i < 2e6; i++) { }
        res.send(`Process ${pid} says hi`);
    });
}

export default {
    withCluster,
    withoutCluster
};