console.log('starting background-app');
globalThis.platformatic.messaging.handle('ping', () => 'pong')

// setTimeout(() => {
//     throw Error('Some critial problem happens a bit later');
// }, 50000)

// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// process.on('uncaughtException', (error) => {
//     console.error('Unhandled Exception', error);
//     process.exit(1);
// });
