const mongoose = require('mongoose');

function getCollectionModel(collectionName) {
  const collectionSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    nombre: { type: String, required: true }
  });
  return mongoose.model(collectionName, collectionSchema);
}

module.exports = getCollectionModel;