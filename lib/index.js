const { JsonPropertyConverter, ConversionTypes } = require('./core/converter')

const jsonPropertyConverter = new JsonPropertyConverter();

module.exports = {
  JsonPropertyConverter: jsonPropertyConverter,
  ConversionTypes,
};
