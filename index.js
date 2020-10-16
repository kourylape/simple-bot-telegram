if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const messageQueue = require('./workers/messageQueue')
const secret = process.env.SECRET || 'A1B2C3D4'

const fromNow = (minutes) => {
  let unix = Date.now()
  const delay = parseInt(minutes)

  if (!isNaN(delay) && delay >= 0) {
    unix += (delay * 60000)
  }

  return unix
}

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.json({ version: '1.0.2' }))

app.post(`/${secret}`, async (req, res) => {
  try {
    const message = req.body.message
    if (message.text === '/chat') {
      if (message.chat.type === 'private') {
        const chat_id = message.chat.id
        await sendMessage(chat_id, `Your Chat ID # is: ${chat_id}`)
      }
    }
    res.send({ success: true })
  } catch (error) {
    console.error(error)
    res.json({ success: false, error: error.message })
  }
})

app.post(`/${secret}/:chat_id`, async (req, res) => {
  try {
    const sendAt = fromNow(req.body.delay || 0)
    const params = {
      chatId: req.params.chat_id || '',
      message: req.body.message || ''
    }
    await messageQueue.createJob(params).delayUntil(sendAt).save()

    res.send({ success: true, willBeSent: new Date(sendAt).toISOString() })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

app.listen(process.env.PORT || 5000, () => console.log('Server Listening'))
