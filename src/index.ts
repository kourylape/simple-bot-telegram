import dotenv from 'dotenv'
import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MessageQueue } from './workers/messageQueue.js'

dotenv.config({ override: true })
const app = express()
const secret = process.env.SECRET ?? 'A1B2C3D4'

app.use(cors())
app.use(express.static(path.join('../public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.json({ version: '2.0.1' }))

app.post(`/${secret}`, async (req, res) => {
  try {
    const message = req.body.message
    if (message.text === '/chat') {
      if (['private', 'group'].includes(message.chat.type)) {
        const chatId: string = message.chat.id
        await MessageQueue.push({
          chatId,
          message: `Your Chat ID # is: ${chatId}`,
          delay: 0
        })
      }
    }
    res.send({ success: true })
  } catch (error: any) {
    console.error(error)
    res.json({ success: false, error: error.message })
  }
})

app.post(`/${secret}/:chat_id`, async (req, res) => {
  try {
    const delay: number = Number(req.body.delay) ?? 1
    const jobParams = {
      chatId: req.params.chat_id ?? '',
      message: req.body.message ?? '',
      delay
    }
    await MessageQueue.push(jobParams)

    res.send({ success: true, message: `Your message will be sent in ${delay} seconds` })
  } catch (error: any) {
    res.json({ success: false, error: error.message })
  }
})

const port = process.env.PORT ?? 8080
app.listen(port, () => console.log(`Server Listening on ${port}`))
