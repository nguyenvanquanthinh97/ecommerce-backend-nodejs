'use strict';
const amqp = require('amqplib');

const receiveEmail = async() => {
  try {
    // 1. create Connect
    const conn = await amqp.connect('amqp://guest:12345@localhost')

    // 2. create Channel
    const channel = await conn.createChannel()

    // 3. create exchange
    const nameExchange = 'send_email'

    await channel.assertExchange(nameExchange, 'topic', { durable: false })

    // 4. create queue
    const {
      queue // name queue
    } = await channel.assertQueue('', { exclusive: true })

    // 5. binding between queue and exchange
    const args = process.argv.slice(2)
    if (!args.length) {
      process.exit(0)
    }

    /*
      * match with every character
      # match with one or more word
    */
    console.log(`waiting queue ${queue}::: topic::${args}`)
    args.forEach(async(topic) => {
      await channel.bindQueue(queue, nameExchange, topic)
    })

    // 4. publish message to exchange
    await channel.consume(queue, (message) => {
      console.log(`Routing key:${message.fields.routingKey}:::msg:::${message.content.toString()}`)
    }, {
      noAck: true
    })
  } catch (error) {
    console.error('Error in receiveEmail:', error);
  }
}

receiveEmail().catch(console.error)
