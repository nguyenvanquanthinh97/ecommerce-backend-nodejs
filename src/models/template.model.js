'use strict';
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Template';
const COLLECTION_NAME = 'Templates';

// Declare the Schema of the Mongo model
const templateSchema = new mongoose.Schema({
  tem_id: { type: Number, required: true },
  tem_name: { type: String, required: true },
  tem_status: { type: String, defualt: 'active'},
  tem_html: { type: String, required: true },
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, templateSchema);
