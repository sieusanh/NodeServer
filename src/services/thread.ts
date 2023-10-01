const { Worker } = require('worker_threads');

const runService = (workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.ts', { workerData });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`stopped with  ${code} exit code`));
        });
    })
}

const run = async () => {
    const result = await runService(999999);
    console.log(result);
}

run().catch(console.log);