'use strict';
const amqp = require('amqplib');

const postVideo = async({msg}) => {
  try {
    // 1. create Connect
    const conn = await amqp.connect('amqp://guest:12345@localhost')

    // 2. create Channel
    const channel = await conn.createChannel()

    // 3. create exchange
    const nameExchange = 'video'

    await channel.assertExchange(nameExchange, 'fanout', { durable: false })

    // 4. publish message to exchange
    await channel.publish(nameExchange, '', Buffer.from(msg))

    console.log(`[x] Send OK:::${msg}`)

    setTimeout(() => {
      channel.close()
      conn.close()
      process.exit(0)
    }, 2000)
  } catch (error) {
    console.error('Error in postVideo:', error);
  }
}

const msg = process.argv.slice(2).join(' ') || 'Hello Exchange'
postVideo({msg}).catch(console.error)
