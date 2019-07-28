const { logger } = require('../../config/logger');

const FormatTypes = {
  UPPERCASE_FORMAT: 'uppercase',
};

/**
 * Method that normalize json object format.
 * Ex: - Replace json string value to uppercase ('UPPERCASE_FORMAT')
 * See 'FormatTypes'.
 * @param jsonNode - json node to normalize
 * @param format - target format
 */
const normalizeFormat = (jsonNode, format) => {
  logger.debug(`Normalize format of ${JSON.stringify(jsonNode)} to '${format}'`);
  const type = typeof jsonNode;

  switch (type) {
    case 'string':
      return _normalizeStringFormat(jsonNode, format);
    default:
  }
  return jsonNode;
};

/**
 * Method that normalize json string.
 * Ex: - Replace json string value to uppercase ('UPPERCASE_FORMAT')
 * See 'FormatTypes'.
 * @param jsonValue - json string to normalize
 * @param format - target format
 */
const _normalizeStringFormat = (jsonValue, format) => {
  switch (format) {
    case FormatTypes.UPPERCASE_FORMAT:
      return jsonValue.toUpperCase();
    default:
  }
  return jsonValue;
};

module.exports = {
  FormatTypes,
  normalizeFormat
};
