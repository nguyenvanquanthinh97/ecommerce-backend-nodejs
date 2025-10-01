'use strict';
const amqp = require('amqplib');

const runProducer = async () => {
  try{
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationExchange';
    const notiQueue = 'notificationQueueProcess';
    const notificationExchangeDLX = 'notificationExchangeDLX';
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    // 1. Create Exchange
    await channel.assertExchange(notificationExchange, 'direct', { durable: true });

    // 2. Create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX, // setup DLX
      deadLetterRoutingKey: notificationRoutingKeyDLX, // setup routing key for DLX
    })

    // 3. Binding Queue to Exchange
    await channel.bindQueue(queueResult.queue, notificationExchange)

    // 4. send message
    const msg = 'A new product has been created';
    console.log(`Producer msg::`, msg);
    // await channel.sendToQueue(notiQueue, Buffer.from(msg), { expiration: '6000' })
    // await channel.publish(notificationExchange, '', Buffer.from(msg), { expiration: '5000' })
    await channel.publish(notificationExchange, '', Buffer.from(msg))

    await channel.close();
    await connection.close()
  } catch(error) {
    console.error(error);
  }
}

runProducer().catch(console.error)
