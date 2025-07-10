const serverless = require('serverless-http');
const app = require('./app');

// AWS Lambda configuration
const handler = serverless(app, {
  binary: false,
  request: (request, event, context) => {
    request.context = context;
    request.event = event;
  },
  response: (response, event, context) => {
    return response;
  }
});

module.exports.handler = handler; 