const jp = require('jsonpath');
const deRef = require('json-schema-deref');
const { logger } = require('../../config/logger');
const { defaultConfig } = require('../../config/normalizer');

/**
 * Method that replace all '$ref' references by definition to obtain a full schema without '$ref'.
 * @param schema
 * @returns {object}
 */
const deReferenceSchema = async schema => new Promise((resolve) => {
  deRef(schema, (err, fullSchema) => {
    resolve(fullSchema);
  });
});

/**
 * Method that extract each field path witch has a type different than 'object'.
 * @param {object} schema - json-schema
 * @param config - normalization configuration parameters
 * @returns {array} paths - array of json-path
 */
const getFieldPaths = (schema, config = defaultConfig) => {
  const typeFieldName = config.fieldNames.type; // 'type' by default
  let paths = jp.paths(schema, `$..[?(@.${typeFieldName} && @.${typeFieldName}!="object")]`);

  // Array path ['$','properties','field'] to jsonPath '$.properties.field'
  paths = paths.map(path => jp.stringify(path));
  // Remove 'definitions' fields
  paths = paths.filter(path => !path.includes('.definitions.'));

  logger.debug(`Paths that must be normalized ${JSON.stringify(paths)}`);
  return paths;
};

/**
 * Method that extract each fields that must be normalized.
 * @param {object} schema - json-schema
 * @param config - normalization configuration parameters
 * @returns {object} map - object that contain json field 'path' + 'type'
 */
const getFieldsToNormalize = (schema, config = defaultConfig) => {
  const paths = getFieldPaths(schema, config);
  const fields = [];
  const typeFieldName = config.fieldNames.type; // 'type' by default
  paths.forEach((path) => {
    fields.push({
      path: path.replace(/.properties./g, '.').replace(/.items/g, '[*]'),
      type: jp.value(schema, path)[typeFieldName],
    });
  });
  logger.debug(`Fields that must be normalized ${JSON.stringify(fields)}`);
  return fields;
};

module.exports = {
  deReferenceSchema,
  getFieldPaths,
  getFieldsToNormalize
};
