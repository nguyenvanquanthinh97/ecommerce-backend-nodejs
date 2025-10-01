'use strict';
const amqp = require('amqplib');
const messages = 'hello, RabbitMQ for Tips javascript!';

const runProducer = async () => {
  try{
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queuename = 'test-topic'
    await channel.assertQueue(queuename, { durable: true })

    // send messages to consumer channel
    await channel.sendToQueue(queuename, Buffer.from(messages), { persistent: true })
    console.log(`message sent:`, messages)

    await channel.close();
    await connection.close()
  } catch(error) {
    console.error(error);
  }
}

runProducer().catch(console.error)
