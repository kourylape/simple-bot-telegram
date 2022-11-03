import dotenv from 'dotenv'
import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import messageQueue from './workers/messageQueue.js'

dotenv.config()
const app = express()

const secret = process.env.SECRET || 'A1B2C3D4'

const fromNow = (minutes: any) => {
  let unix = Date.now()
  const delay = parseInt(minutes)

  if (!isNaN(delay) && delay >= 0) {
    unix += (delay * 60000)
  }

  return unix
}

app.use(cors())
app.use(express.static(path.join('../public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req: any, res: any) => res.json({ version: '1.0.2' }))

app.post(`/${secret}`, async (req: any, res: any) => {
  try {
    const message = req.body.message
    if (message.text === '/chat') {
      if (['private', 'group'].includes(message.chat.type)) {
        const chatId = message.chat.id
        await messageQueue.createJob({
          chatId: chatId,
          message: `Your Chat ID # is: ${chatId}`
        }).save()
      }
    }
    res.send({ success: true })
  } catch (error: any) {
    console.error(error)
    res.json({ success: false, error: error.message })
  }
})

app.post(`/${secret}/:chat_id`, async (req: any, res: any) => {
  try {
    const sendAt = fromNow(req.body.delay || 0)
    const params = {
      chatId: req.params.chat_id || '',
      message: req.body.message || ''
    }
    await messageQueue.createJob(params).delayUntil(sendAt).save()

    res.send({ success: true, willBeSent: new Date(sendAt).toISOString() })
  } catch (error: any) {
    res.json({ success: false, error: error.message })
  }
})

app.listen(process.env.PORT || 5000, () => console.log('Server Listening'))
