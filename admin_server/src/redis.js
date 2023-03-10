import { createClient } from 'redis';


export let redisClient = createClient()
redisClient.on('error', err => console.log('Redis Client Error', err));

export async function initRedis() {
  await redisClient.connect();
}