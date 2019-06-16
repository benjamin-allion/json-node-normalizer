const jp = require('jsonpath');
const { logger } = require('../../config/logger');
const { convertJsonNode } = require('./types');
const { deReferenceSchema, getFieldsToNormalize } = require('./schema');

/**
 * Method that will normalize each fields based on 'type' information
 * that has been described in the Json-Schema.
 * @param jsonObject - json object to convert
 * @param paths - can be an array or unique path/jsonPath value. (Ex: 'root.field.fieldToConvert')
 * @param type - target field/node type, see 'types.js'
 * @returns {object}
 */
const convert = async (jsonNode, jsonSchema) => {
  logger.debug(`Trying to normalize : '${JSON.stringify(jsonNode)}'`);
  logger.debug(`Based on Json-Schema information : '${JSON.stringify(jsonSchema)}'`);
  let jsonResult = { ...jsonNode };
  const deReferencedSchema = await deReferenceSchema(jsonSchema);
  const fields = getFieldsToNormalize(deReferencedSchema);

  fields.forEach((field) => {
    jsonResult = convertFromPath(jsonResult, field.path, field.type);
  });
  return jsonResult;
};

/**
 * Converts json object fields/nodes (from node path) to specified target type.
 * @param jsonObject - json object to convert
 * @param paths - can be an array or unique path/jsonPath value. (Ex: 'root.field.fieldToConvert')
 * @param type - target field/node type, see 'types.js'
 * @returns {object}
 */
const convertFromPath = (jsonNode, paths, type) => {
  let jsonResult = { ...jsonNode };
  const pathsArray = (typeof paths === 'string') ? [paths] : paths;

  pathsArray.forEach((path) => {
    let jsonPath = path;
    logger.debug(`Start transformation of field(s) '${path}' to '${type}'`);
    // Convert String path format to JsonPath
    if (!path.startsWith('$')) {
      jsonPath = `$.${path}`;
      jsonPath = jsonPath.replace(/\.\*\./g, '[*].');
    }
    jsonResult = convertNode(jsonResult, jsonPath, type);
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
const convertNode = (jsonNode, path, type) => {
  const jsonResult = { ...jsonNode };
  logger.debug(`Json object conversion method called for ${path}`);
  logger.debug(`Current JSON to transform : ${JSON.stringify(jsonNode)}`);

  jp.apply(jsonResult, path, (value) => {
    logger.debug(`Converting Node '${JSON.stringify(value)}' to '${type}'`);
    return convertJsonNode(value, type);
  });

  logger.debug(`Conversion complete : ${JSON.stringify(jsonResult)}`);
  return jsonResult;
};

module.exports = {
  convert,
  convertFromPath,
  convertNode
};
