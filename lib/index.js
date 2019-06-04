const { NodeTypeConverter } = require('./core/converter');
const { ConversionTypes } = require('./core/types');

module.exports = {
  NodeTypeConverter: new NodeTypeConverter(),
  ConversionTypes,
};
