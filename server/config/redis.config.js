import { createClient } from 'redis';
import { REDIS_PASSWORD, REDIS_SOCKET } from './const.config.js';

const client = createClient({
  password: REDIS_PASSWORD,
  socket: REDIS_SOCKET,
});

// client.on('error', (err) => {
//   console.error('Redis Client Error', err)
//   if (err.code === 'ETIMEDOUT') {
//     console.error('Redis connection timed out. Stopping the server.')
//     process.exit(1) // Stop the server and let nodemon restart it
//   }
//   process.exit(1) // Stop the server and let nodemon restart it
// })

// client
//   .connect()
//   .then(() => {
//     console.log('Connected to Redis')
//   })
//   .catch((err) => {
//     console.error('Failed to connect to Redis:', err)

//     if (err.code === 'ETIMEDOUT') {
//       console.error('Redis connection timed out. Stopping the server.')
//     }
//     process.exit(1)
//   })

//   if (err.code === 'ETIMEDOUT') {
//     console.error('Redis connection timed out. Stopping the server.')
//     process.exit(1) // Stop the server and let nodemon restart it
//   }
//   process.exit(1) // Stop the server and let nodemon restart it
// })

// client.connect().then(() => {
//   console.log('Connected to Redis');
// });
// .catch((err) => {
//   console.error('Failed to connect to Redis:', err)

//   if (err.code === 'ETIMEDOUT') {
//     console.error('Redis connection timed out. Stopping the server.')
//   }
//   process.exit(1)
// })

export default client;
