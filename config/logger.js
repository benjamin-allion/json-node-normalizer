const { createLogger, format, transports } = require('winston');

let logger = {
  debug: () => {}
};

if (process.env.JSON_NODE_NORMALIZER_DEBUG?.toLowerCase() === 'true') {
  logger = createLogger({
    level: process.env.JSON_NODE_NORMALIZER_LOGGING_LEVEL || 'info',
    format: format.json(),
    transports: [
      new transports.Console(),
    ],
  });
}

module.exports = {
  logger,
};
