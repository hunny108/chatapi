const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect();

module.exports = client;
