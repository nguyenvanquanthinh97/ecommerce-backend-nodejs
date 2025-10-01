'use strict';
const amqp = require('amqplib');

const runConsumer = async () => {
  try{
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queuename = 'test-topic'
    await channel.assertQueue(queuename, { durable: true })

    // send messages to consumer channel
    channel.consume(queuename, (messages) => {
      console.log(`Received ${messages.content.toString()}`)
    }, {
      noAck: true
    })
  } catch(error) {
    console.error(error);
  }
}

runConsumer().catch(console.error)
