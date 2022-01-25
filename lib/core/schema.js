const jp = require('jsonpath');
const deRef = require('json-schema-deref');
const { logger } = require('../../config/logger');
const { defaultConfig } = require('../../config/normalizer');

/**
 * Method that extract each field path witch has a type different than 'object'.
 * @param {object} schema - json-schema
 * @param customConfig - normalization configuration parameters
 * @private
 * @returns {array} paths - array of json-path
 */
const _getFieldPaths = (schema, customConfig = {}) => {
  const config = { ...defaultConfig, ...customConfig };
  let paths = jp.paths(schema, `$..[?(@.${config.typeFieldName} && @.${config.typeFieldName}!="object")]`);

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
 * @param customConfig - normalization configuration parameters
 * @returns {object} map - object that contain json field 'path' + 'type'
 */
const getFieldsToNormalize = (schema, customConfig = {}) => {
  const config = { ...defaultConfig, ...customConfig };
  const paths = _getFieldPaths(schema, config);
  const fields = [];
  paths.forEach(path => {
    const jpValue = jp.value(schema, path);

    const field = {
      path: path.replace(/.properties./g, '.').replace(/.items/g, '[*]'),
      type: jpValue[config.typeFieldName],
      format: jpValue[config.formatFieldName],
      default: jpValue[config.defaultFieldName],
    };

    const isExclude = config.excludePaths.some(excludePath => Object.entries(excludePath).every(([key, value]) => field[key] === value),);
    if (!isExclude) {
      fields.push(field);
    }
  });
  logger.debug(`Fields that must be normalized ${JSON.stringify(fields)}`);
  return fields;
};

/**
 * Method that replace all '$ref' references by definition to obtain a full schema without '$ref'.
 * @param schema
 * @returns {object}
 */
const deReferenceSchema = async schema => new Promise(resolve => {
  deRef(schema, (err, fullSchema) => {
    resolve(fullSchema);
  });
});

module.exports = {
  getFieldsToNormalize,
  deReferenceSchema,
  _getFieldPaths, // For unit test only
};
