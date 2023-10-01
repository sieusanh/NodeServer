const { parentPort, workerData } = require('worker_threads');

const fibonacci = (n) => {
    var i;
    var fib = [];

    fib[0] = 0;
    fib[1] = 1;
    for (i = 2; i <= n; i++) {
        fib[i] = fib[i - 2] + fib[i - 1];
    }

    parentPort.postMessage(fib);
}

fibonacci(workerData);