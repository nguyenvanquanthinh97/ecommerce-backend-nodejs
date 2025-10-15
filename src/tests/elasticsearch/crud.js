const { getESClient, initES } = require("../../dbs/init.elasticsearch");

initES({
  ELASTICSEARCH_IS_ENABLED: true,
});

const esClient = getESClient();

// search documentation
const searchDocument = async ({idxName, docType, payload}) => {
  const result = await esClient.search({
    index: idxName,
    type: docType,
    body: payload,
  });

  console.log(`search::`, result?.body?.hits?.hits);
};

const addDocument = async ({ idxName, _id, docType, payload }) => {
  try {
    const newDoc = await esClient.index({
      index: idxName,
      type: docType,
      id: _id,
      body: payload,
    })

    console.log(`add new::`, newDoc)
  } catch (error) {
    console.error(`error::`, error)
    throw error
  }
};

// test run
// addDocument({
//   idxName: 'product_v001',
//   _id: '111333',
//   docType: 'product',
//   payload: {
//     title: 'iphone 15',
//     price: 1111,
//     images: '...',
//     category: 'mobile'
//   }
// }).then(console.log)

searchDocument({
  idxName: 'product_v001',
  docType: 'product'
}).then()

module.exports = {
  searchDocument,
  addDocument
};
