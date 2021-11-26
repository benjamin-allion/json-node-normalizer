const { normalize, normalizePaths, clearCache } = require('./core/normalizer');
const { NodeTypes } = require('./core/types');
const { oasFlatten } = require('./core/oasFlatter');

module.exports = {
  normalize,
  clearCache,
  normalizePaths,
  NodeTypes,
  oasFlatten
};
