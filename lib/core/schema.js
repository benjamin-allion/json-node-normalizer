const { logger } = require('../../config/logger');
const deRef = require('json-schema-deref');
const jp = require('jsonpath');

/**
 * Method that replace all '$ref' references by definition to obtain a full schema without '$ref'.
 * @param schema
 * @returns {object}
 */
const deReferenceSchema = async schema => new Promise((resolve, reject) => {
  deRef(schema, (err, fullSchema) => {
    if (!err) {
      resolve(fullSchema);
    } else {
      logger.error('Error when trying to parse Json-Schema :');
      logger.error(err);
    }
    reject(err);
  });
});

/**
 * Method that extract each field path witch has a type different than 'object'.
 * @param {object} schema - json-schema
 * @returns {array} paths - array of json-path
 */
const getFieldPaths = (schema) => {
  let paths = jp.paths(schema, '$..[?(@.type && @.type!="object")]');

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
 * @returns {object} map - object that contain json field 'path' + 'type'
 */
const getFieldsToNormalize = (schema) => {
  const paths = getFieldPaths(schema);
  const fields = [];
  paths.forEach((path) => {
    fields.push({
      path: path.replace('.properties.', '.').replace('.items.', '[*].'),
      type: jp.value(schema, path).type,
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
