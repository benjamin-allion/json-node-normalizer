const { logger } = require('../../config/logger');

const ConversionTypes = {
  ARRAY_TYPE: 'array',
  NUMBER_TYPE: 'number',
  INTEGER_TYPE: 'integer',
  BOOLEAN_TYPE: 'boolean',
  STRING_TYPE: 'string'
};

/**
 * Method that convert json object type by another one.
 * Ex: - Replace single json object to json object array (ARRAY_TYPE)
 * See 'ConversionTypes'.
 * @param jsonNode - json node to convert
 * @param type - target type
 */
const convertJsonNode = (jsonNode, type) => {
  logger.debug(`Normalize ${JSON.stringify(jsonNode)} to '${type}'`);
  switch (type) {
    // Convert single json object to json object array
    case ConversionTypes.ARRAY_TYPE:
      return !Array.isArray(jsonNode) ? [jsonNode] : jsonNode;
    case ConversionTypes.NUMBER_TYPE:
      return !Number.isInteger(jsonNode) ? parseInt(jsonNode, 10) : jsonNode;
    case ConversionTypes.INTEGER_TYPE:
      return !Number.isInteger(jsonNode) ? parseInt(jsonNode, 10) : jsonNode;
    case ConversionTypes.BOOLEAN_TYPE:
      return typeof jsonNode !== 'boolean' ? Boolean(jsonNode) : jsonNode;
    case ConversionTypes.STRING_TYPE:
      return typeof jsonNode !== 'string' ? `${jsonNode}` : jsonNode;
    default:
  }
  return jsonNode;
};

module.exports = {
  ConversionTypes,
  convertJsonNode
};
