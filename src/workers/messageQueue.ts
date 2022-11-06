import fastq from 'fastq'
import type { queueAsPromised } from 'fastq'
import got from 'got'

interface Message {
  chatId: string
  message: string
  delay: number
}

export const MessageQueue: queueAsPromised<Message> = fastq.promise(messageQueue, 5)

async function messageQueue (args: Message): Promise<void> {
  const auth = process.env.AUTH ?? 'ABC123'
  const url = `https://api.telegram.org/bot${auth}/sendMessage`

  setTimeout(async () => {
    await got.post(url, {
      json: {
        chat_id: args.chatId ?? '',
        text: args.message ?? ''
      }
    })
  }, args.delay)
}
