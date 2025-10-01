'use strict';
const amqp = require('amqplib');

const receiveNoti = async() => {
  try {
    // 1. create Connect
    const conn = await amqp.connect('amqp://guest:12345@localhost')

    // 2. create Channel
    const channel = await conn.createChannel()

    // 3. create exchange
    const nameExchange = 'video'

    await channel.assertExchange(nameExchange, 'fanout', { durable: false })

    // 4. create queue
    const {
      queue // name queue
    } = await channel.assertQueue('', { exclusive: true })

    console.log(`nameQueue:::${queue}`)

    // 5. binding
    await channel.bindQueue(queue, nameExchange, '')

    await channel.consume(queue, (message) => {
      console.log(`msg:::${message.content.toString()}`)
    }, {
      noAck: true
    })

  } catch (error) {
    console.error('Error in postVideo:', error);
  }
}

receiveNoti().catch(console.error)
