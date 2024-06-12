const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, db } = require('../services/storeData');

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    console.log('Received image:', image);
    
    if (!image || !image._data) {
      console.error('Invalid image data received:', image);
      return h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi'
      }).code(400);
    }

    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image._data);
    console.log('Prediction result:', { confidenceScore, label, explanation, suggestion });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt
    };

    await storeData(id, data);

    return h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data: {
        id: id,
        result: label,
        suggestion: suggestion,
        createdAt: createdAt
      }
    }).code(201);
  } catch (error) {
    console.error('Error during prediction:', error);

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400);
  }
}

async function getPredictionHistoriesHandler(request, h) {
  try {
    const predictionsSnapshot = await db.collection('prediction').get();
    const predictions = [];

    predictionsSnapshot.forEach(doc => {
      const data = doc.data();
        predictions.push({
          id: data.id,
          history: {
            result: data.result,
            createdAt: data.createdAt,
            suggestion: data.suggestion,
            id: data.id,
        }
      });
    });

    return h.response({
      status: 'success',
      data: predictions
    }).code(200);
  } catch (error) {
    console.error('Error fetching prediction histories:', error);

    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mengambil data prediksi'
    }).code(500);
  }
}

module.exports = { postPredictHandler, getPredictionHistoriesHandler };