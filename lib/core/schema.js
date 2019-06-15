const { logger } = require('../../config/logger');
const deRef = require('json-schema-deref');

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

module.exports = deReferenceSchema;
