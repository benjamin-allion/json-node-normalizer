const { logger } = require('../../config/logger');

const NodeTypes = {
  ARRAY_TYPE: 'array',
  NUMBER_TYPE: 'number',
  INTEGER_TYPE: 'integer',
  BOOLEAN_TYPE: 'boolean',
  STRING_TYPE: 'string',
  NULL_TYPE: 'null'
};

/**
 * Method that convert json object type by another one.
 * Ex: - Replace single json object to json object array (ARRAY_TYPE)
 * See 'ConversionTypes'.
 * @param jsonNode - json node to convert
 * @param type - target type
 */
const convertType = (jsonNode, type) => {
  logger.debug(`Normalize ${JSON.stringify(jsonNode)} to '${type}'`);
  switch (type) {
    // Convert single json object to json object array
    case NodeTypes.ARRAY_TYPE:
      return !Array.isArray(jsonNode) ? [jsonNode] : jsonNode;
    case NodeTypes.NUMBER_TYPE:
      return _convertToNumber(jsonNode);
    case NodeTypes.INTEGER_TYPE:
      return !Number.isInteger(jsonNode) ? parseInt(jsonNode, 10) : jsonNode;
    case NodeTypes.BOOLEAN_TYPE:
      return typeof jsonNode !== 'boolean' ? _convertToBoolean(jsonNode) : jsonNode;
    case NodeTypes.STRING_TYPE:
      return typeof jsonNode !== 'string' ? `${jsonNode}` : jsonNode;
    case NodeTypes.NULL_TYPE:
      return null;
    default:
  }
  return jsonNode;
};

/**
 * Method that convert jsonNode to Boolean type
 * @param jsonNode
 * @returns {boolean}
 * @private
 */
const _convertToBoolean = (jsonNode) => {
  const jsonNodeType = typeof jsonNode;
  const jsonNodeTypeIsString = jsonNodeType === 'string';
  if (jsonNodeTypeIsString) {
    const jsonNodeValue = jsonNode.toLowerCase();
    if (jsonNodeValue === 'true') {
      return true;
    }
    return false;
  }
  return Boolean(jsonNode);
};

/**
 * Method that convert jsonNode to Json Number type
 * @param jsonNode
 * @returns {number}
 * @private
 */
const _convertToNumber = (jsonNode) => {
  let result = jsonNode;
  const jsonNodeType = typeof jsonNode;
  const jsonNodeTypeIsNumber = jsonNodeType === 'number';

  if (!jsonNodeTypeIsNumber) {
    const jsonNodeTypeIsString = jsonNodeType === 'string';
    result = jsonNodeTypeIsString ? result.replace(/,/g, '.') : result;
    result = parseFloat(result);
  }

  return result;
};

module.exports = {
  NodeTypes,
  convertType
};
