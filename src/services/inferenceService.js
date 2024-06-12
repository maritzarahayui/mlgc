const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const loadModel = require('../services/loadModel');

async function predictClassification(model, imageBuffer) {
  const tensor = tf.node
    .decodeJpeg(imageBuffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = Math.max(...score) * 100;

  const classes = ['Cancer', 'Non-cancer'];

  const classResult = tf.argMax(prediction, 1).dataSync()[0];
  let label = classes[classResult];

  let explanation, suggestion;

  if (confidenceScore > 50) {
    label = 'Cancer';
    explanation = "Ini kanker";
    suggestion = "Segera periksa ke dokter!";
  } else {
    label = 'Non-cancer';
    explanation = "Ini bukan kanker";
    suggestion = "Tetap semangat!";
  }

  return { confidenceScore, label, explanation, suggestion };
}

module.exports = predictClassification;
