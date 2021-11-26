const jp = require('jsonpath');
const SchemaCache = require('./schemaCache');
const { logger } = require('../../config/logger');
const { convertType } = require('./types');
const { normalizeFormat } = require('./formats');
const { defaultConfig } = require('../../config/normalizer');
const { deReferenceSchema, getFieldsToNormalize } = require('./schema');
const { expandArraysPaths } = require('../helpers/objectPathHelper');

/**
 * Method that will normalize each fields based on 'type' information
 * that has been described in the Json-Schema.
 * @param {object} jsonNode - json object to normalize
 * @param {object} jsonSchema - json schema that describing target object format.
 * @param {object} customConfig - normalization configuration (see '/config/normalizer.js')
 * @returns {object}
 */
const normalize = async (jsonNode, jsonSchema, customConfig = {}) => {
  const config = { ...defaultConfig, ...customConfig };
  logger.debug(`Trying to normalize : '${JSON.stringify(jsonNode)}'`);
  logger.debug(`Based on Json-Schema information : '${JSON.stringify(jsonSchema)}'`);
  let jsonResult = { ...jsonNode };

  let fieldsToNormalize;

  if (config.useCache) {
    const jsonSchemaId = `${config.cacheId}`;
    fieldsToNormalize = SchemaCache.getData(jsonSchemaId);

    if (!fieldsToNormalize) {
      const deReferencedSchema = await deReferenceSchema(jsonSchema);
      fieldsToNormalize = getFieldsToNormalize(deReferencedSchema, config);
      SchemaCache.setData(jsonSchemaId, fieldsToNormalize, config.cacheDuration);
    }
  }

  if (!config.useCache) {
    const deReferencedSchema = await deReferenceSchema(jsonSchema);
    fieldsToNormalize = getFieldsToNormalize(deReferencedSchema, config);
  }

  fieldsToNormalize.forEach((field) => {
    jsonResult = normalizePaths({
      jsonNode: jsonResult,
      paths: [field.path],
      type: field.type,
      format: field.format,
      defaultValue: field.default
    });
  });
  return jsonResult;
};

/**
 * Converts json object fields/nodes (from node path) to specified target type.
 * @param {object} jsonNode - json object to convert
 * @param {Array<string>} paths (Ex: ['root.field.fieldToConvert'])
 * @param {string} type - target field/node type, see 'types.js'
 * @param {string} format - target field format, see 'formats.js'
 * @param {object} defaultValue - target field default value
 * @returns {object}
 */
const normalizePaths = ({
  jsonNode,
  paths,
  type,
  format = undefined,
  defaultValue = undefined
}) => {
  let jsonResult = { ...jsonNode };
  paths.forEach((path) => {
    let jsonPath = path;
    logger.debug(`Start transformation of field(s) '${path}' to '${type}'`);
    // Convert String path format to JsonPath
    if (!path.startsWith('$')) {
      jsonPath = `$.${path}`;
      jsonPath = jsonPath.replace(/\.\*\./g, '[*].');
    }
    jsonResult = normalizeNode({
      jsonNode: jsonResult,
      path: jsonPath,
      type,
      format,
      defaultValue
    });
  });
  return jsonResult;
};

/**
 * Transform the type of inner json object fields (from path).
 * @param {object} jsonNode - json object to transform
 * @param {string} path - json path of object that must be replaced
 * @param {string} type - target field type, see 'types.js'
 * @param {string} format - target field format, see 'formats.js'
 * @param {object} defaultValue - target field default value
 * @returns {object}
 */
const normalizeNode = ({
  jsonNode,
  path,
  type,
  format = undefined,
  defaultValue = undefined
}) => {
  let jsonResult = { ...jsonNode };
  const mustBeFormatted = (format !== undefined && format !== null);
  logger.debug(`Json object conversion method called for ${path}`);
  logger.debug(`Current JSON to transform : ${JSON.stringify(jsonNode)}`);

  if (defaultValue) { jsonResult = setDefaultValues(jsonResult, path, defaultValue); }

  jp.apply(jsonResult, path, (value) => {
    logger.debug(`Converting Node '${JSON.stringify(value)}' to '${type}'`);
    const normalizedNode = convertType(value, type);
    return mustBeFormatted ? normalizeFormat(normalizedNode, format) : normalizedNode;
  });

  logger.debug(`Conversion complete : ${JSON.stringify(jsonResult)}`);
  return jsonResult;
};

/**
 * Set all default values for a given path (that could contain array / nested objects)
 * @param {object} jsonNode
 * @param {string} path
 * @param {any} defaultValue
 */
const setDefaultValues = (jsonNode, path, defaultValue) => {
  let jsonResult = { ...jsonNode };
  const nestedPaths = getNestedPaths(jsonResult, path);
  nestedPaths.forEach((nestedPath) => {
    jsonResult = setDefaultValueForPath(jsonResult, nestedPath, defaultValue);
  });
  return jsonResult;
};

/**
 * Returns nested json path from json path expression that contains array.
 * Example :
 * IN fields.addresses[*].details[*].notes
 * OUT [fields.addresses[0].details[0].notes, fields.addresses[0].details[1].notes...]
 *
 * @param {object} jsonNode
 * @param {string} path
 * @returns {string[]|*[]}
 */
const getNestedPaths = (jsonNode, path) => {
  if (!path.includes('[*]')) { return [path]; }
  const pathWithoutJpPrefix = path.replace('$.', '');
  const nestedPaths = expandArraysPaths({
    object: jsonNode,
    paths: [pathWithoutJpPrefix]
  });
  return nestedPaths;
};

/**
 * set default value for a given path
 * @param {object} jsonNode
 * @param {string} path
 * @param {any} defaultValue
 */
const setDefaultValueForPath = (jsonNode, path, defaultValue) => {
  const jsonResult = { ...jsonNode };
  const fieldValue = jp.value(jsonNode, path);
  const isFieldDefined = fieldValue !== undefined && fieldValue !== null;

  if (!isFieldDefined && isParentExists(jsonNode, path)) {
    jp.value(jsonResult, path, defaultValue);
  }
  return jsonResult;
};

/**
 * Returns if node parent exists for specified path
 * @param {object} jsonNode
 * @param {string} path
 * @returns {boolean}
 */
const isParentExists = (jsonNode, path) => {
  const parentPath = path.substring(0, path.lastIndexOf('.'));
  return !!jp.value(jsonNode, parentPath);
};

/**
 * Reset the cache
 */
const clearCache = () => {
  SchemaCache.clearCache();
};

module.exports = {
  normalize,
  normalizePaths,
  normalizeNode,
  clearCache
};
