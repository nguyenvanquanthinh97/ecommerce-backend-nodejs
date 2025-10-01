"use strict";
const amqp = require('amqplib')

async function producerOrderedMessage() {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "ordered-queued-message";
    await channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 10; i++) {
      const message = `ordered-queued-message::${i}`
      console.log(`message: ${message}`)

      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true
      })
    }

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 1000)
  } catch (error) {
    console.error(error);
  }
}

producerOrderedMessage().catch(err => console.error(err))
