const Queue = require('bee-queue')
const got = require('got')
const redis = require('redis')

// setup queue
const messageQueue = new Queue('message', {
  prefix: 'sbt',
  redis: redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379'),
  sendEvents: false,
  removeOnSuccess: true,
  removeOnFailure: true,
  activateDelayedJobs: true
})

messageQueue.on('error', (error) => {
  console.error(error)
})

messageQueue.on('failed', (job, error) => {
  console.log(`Job ${job.id} failed!`)
  console.error(error)
})

messageQueue.process(async (job, done) => {
  const auth = process.env.AUTH || 'ABC123'
  const url = `https://api.telegram.org/bot${auth}/sendMessage`

  await got.post(url, {
    json: {
      chat_id: job.data.chatId || '',
      text: job.data.message || ''
    }
  })

  return done()
})

module.exports = messageQueue
