import generateData from './data/generator';
import services from './services';

const {
    startServer, routeCompression, routeBcrypt,
    withCluster, withoutCluster
} = services;

generateData();
startServer();
// routeCompression();
// routeBcrypt();

// withoutCluster();
// withCluster();