const { normalize, normalizePaths } = require('./core/normalizer');
const { NodeTypes } = require('./core/types');
const { oasFlatten } = require('./core/oasFlatter');

module.exports = {
  normalize,
  normalizePaths,
  NodeTypes,
  oasFlatten
};
