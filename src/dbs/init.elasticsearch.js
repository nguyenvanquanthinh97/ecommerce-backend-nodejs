'use strict';
const { Client } = require('@elastic/elasticsearch');

let client = {}

const instanceEventListener = async (elasticClient) => {
  try {
    await elasticClient.ping();
    console.log(`Successfully connected elasticsearch`)
  } catch (error) {
    console.error(`Error connecting to elasticsearch`, error);
  }
}
const initES = ({
  ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_HOST = 'http://localhost:9200'
}) => {
  if (ELASTICSEARCH_IS_ENABLED) {
    const elasticClient = new Client({ node: ELASTICSEARCH_HOST });
    client.elasticClient = elasticClient
    // handler connect
    instanceEventListener(elasticClient)
  }
}

const getESClient = () => {
  return client.elasticClient
}


module.exports = {
  initES,
  getESClient,
};
