const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: format.json(),
  transports: [
    new transports.Console(),
  ],
});

module.exports = {
  logger,
};
