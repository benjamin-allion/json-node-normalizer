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
      return _convertToBoolean(jsonNode);
    case NodeTypes.STRING_TYPE:
      return _convertToString(jsonNode);
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
  if (typeof jsonNode === 'boolean') { return jsonNode; }
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
 * Method that convert jsonNode to String type
 * In case of jsonNode is not an object :
 * - Returns the string value
 * In case of jsonNode is an object :
 * - Returns '' if jsonNode is an empty object
 * - Returns toString method result if exists
 * - Returns JSON.Stringify result if not
 * @param {object} jsonNode
 * @returns {string | null}
 * @private
 */
const _convertToString = (jsonNode) => {
  if (typeof jsonNode === 'undefined') { return undefined; }
  const isObject = (typeof jsonNode === 'object');
  if (!isObject) { return `${jsonNode}`; }
  if (jsonNode === null) { return null; }

  if (!Object.keys(jsonNode).length) { return ''; }
  // eslint-disable-next-line no-prototype-builtins
  if (jsonNode.hasOwnProperty('toString')) { return jsonNode.toString(); }
  return JSON.stringify(jsonNode);
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
