const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const got = require('got')
const app = express()
const secret = process.env.SECRET || 'A1B2C3D4'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.json({ version: '1.0.0' }))

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

app.post('/send/:chat_id', async (req, res) => {
  try {
    const chat_id = req.params.chat_id
    const message = req.body.message

    if (message) {
      await sendMessage(chat_id, message)
    }

    res.send({ success: true })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

const sendMessage = async (chat_id = null, message = '') => {
  const auth = process.env.AUTH || 'ABC123'
  const url = `https://api.telegram.org/bot${auth}/sendMessage`

  await got.post(url, {
    json: {
      chat_id: chat_id,
      text: message
    }
  })
}

app.listen(process.env.PORT || 5000, () => console.log('Server Listening'))