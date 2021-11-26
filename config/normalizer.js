/**
 * Json normalizer default configuration
 * @type {object}
 */
const defaultConfig = {
  typeFieldName: 'type',
  formatFieldName: 'format',
  defaultFieldName: 'default',
  useCache: false,
  cacheId: "$id",
  cacheDuration: 100
};

module.exports = {
  defaultConfig,
};
