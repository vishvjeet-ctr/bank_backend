import apicache from 'apicache'
import redis from 'redis'

const redisClient = redis.createClient()
redisClient.on('error', (error) => {
  console.error('Redis cache connection error:', error.message)
})

const cacheWithRedis = apicache.options({ redisClient }).middleware


export default cacheWithRedis;
