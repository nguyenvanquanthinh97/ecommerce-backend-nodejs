'use strict';
const amqp = require('amqplib');

const sendEmail = async({msg, topic}) => {
  try {
    // 1. create Connect
    const conn = await amqp.connect('amqp://guest:12345@localhost')

    // 2. create Channel
    const channel = await conn.createChannel()

    // 3. create exchange
    const nameExchange = 'send_email'

    await channel.assertExchange(nameExchange, 'topic', { durable: false })

    // 4. publish message to exchange
    await channel.publish(nameExchange, topic, Buffer.from(msg), { persistent: true})

    console.log(`[x] Send OK:::${msg}`)

    setTimeout(() => {
      channel.close()
      conn.close()
      process.exit(0)
    }, 2000)
  } catch (error) {
    console.error('Error in sendEmail:', error);
  }
}

const args = process.argv.slice(2)
const msg = args[1] || 'Fixed!'
const topic = args[0]
sendEmail({msg, topic}).catch(console.error)
