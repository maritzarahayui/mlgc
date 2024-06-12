const { postPredictHandler, getPredictionHistoriesHandler } = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000000,
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        failAction: (request, h, err) => {
          if (err.output.statusCode === 413) {
            return h.response({
              status: 'fail',
              message: 'Payload content length greater than maximum allowed: 1000000'
            }).code(413).takeover();
          }
          throw err;
        }
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictionHistoriesHandler,
  }
]

module.exports = routes;