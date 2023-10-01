
import cluster from 'cluster';
import process from 'process';
import os from 'os';

function Concurrency() {
    const numCPU = os.cpus().length;

    if (cluster.isPrimary) {
        for (let i = 0; i < numCPU; i++) {
            cluster.fork();
        }
    } else {

    }
}