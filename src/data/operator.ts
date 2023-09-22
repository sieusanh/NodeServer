// import log from 'log';
// import pgService from '../database/postgres';

// async function operator(queryString: string, values: string[], logName: string) {
//     const logger = log.get(logName)
//     logger.info(``);

//     // const client = await pgService.connect();
//     // const data = await client.query(queryString, values);
//     const data = await pgService.query(queryString, values);
//     // await client.release();
//     return data;
// }

// export { operator };