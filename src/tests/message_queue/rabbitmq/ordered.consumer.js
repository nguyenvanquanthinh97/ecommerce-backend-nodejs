"use strict";
const amqp = require('amqplib')



async function consumerOrderedMessage() {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "ordered-queued-message";
    await channel.assertQueue(queueName, { durable: true });

    // Set prefetch to 1 to process one message at a time
    channel.prefetch(1)

    channel.consume(queueName, msg => {
      const message = msg.content.toString()

      setTimeout(() => {
        console.log('processed:', message)
        channel.ack(msg)
      }, Math.random() * 1000)
    })
  } catch (error) {
    console.error(error);
  }
}

consumerOrderedMessage().catch(err => console.error(err))
