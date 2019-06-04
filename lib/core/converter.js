/**
 * Json property converter class
 * MIT LICENCE
 */
const jp = require('jsonpath');
const { logger } = require('../../config/logger');
const { convertJsonNode } = require('./types');

/**
 * Converts json object fields/nodes (from path) to specified target type.
 * @param jsonObject - json object to convert
 * @param paths - can be an array or unique path/jsonPath value. (Ex: 'root.field.fieldToConvert')
 * @param type - target field/node type, see 'types.js'
 * @returns {object}
 */
const convert = (jsonNode, paths, type) => {
  let jsonResult = { ...jsonNode };
  const pathsArray = (typeof paths === 'string') ? [paths] : paths;

  pathsArray.forEach((path) => {
    let jsonPath = path;
    logger.log('debug', `Start transformation of field(s) '${path}' to '${type}'`);
    // Convert String path format to JsonPath
    if (!path.startsWith('$')) {
      jsonPath = `$.${path}`;
      jsonPath = jsonPath.replace(/\.\*\./g, '[*].');
    }
    jsonResult = convertNodeType(jsonResult, jsonPath, type);
  });
  return jsonResult;
};

/**
 * Transform the type of inner json object fields (from path).
 * @param jsonNode - json object to transform
 * @param path - json path of object that must be replaced
 * @param type - target field type, see 'types.js'
 * @returns {object}
 * @private
 */
const convertNodeType = (jsonNode, path, type) => {
  const jsonResult = { ...jsonNode };
  logger.log('debug', `Json object conversion method called for ${path}`);
  logger.log('debug', `Current JSON to transform : ${JSON.stringify(jsonNode)}`);

  jp.apply(jsonResult, path, (value) => {
    logger.log('debug', `Converting Node '${JSON.stringify(value)}' to '${type}'`);
    return convertJsonNode(value, type);
  });

  logger.log('debug', `Conversion complete : ${JSON.stringify(jsonResult)}`);
  return jsonResult;
};

module.exports = {
  convert
};
