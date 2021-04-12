const { get: _get } = require('lodash');

/**
 * Expand the arrays path from the input paths, according to the input object
 *
 * @param {object} params
 * @param {object} params.object the source object from which retrieve the paths
 * @param {string[]} params.paths the original paths, non expanded
 * @param {string} params.arraySymbol the symbol used to define an array field in the path
 * @return {string[]} the input paths, expanded
 *
 * @example
 * // returns ['foo.bar[0].gee', 'foo.bar[1].gee']
 * expandArraysPaths(
 * { object: { foo: { bar: [{ gee: 'valX' }, { gee: 'valY' }] } }, paths: ['foo.bar[].gee'] }
 * )
 * @example
 * // returns ['foo.bar[0].gee', 'foo.bar[1].gee']
 * expandArraysPaths(
 * {
 *  object: { foo: { bar: [{ gee: 'valX' }, { gee: 'valY' }] } },
 *  paths: ['foo.bar.*.gee'],
 *  arraySymbol: '.*'
 * }
 * )
 */
const expandArraysPaths = ({ object = {}, paths = [], arraySymbol = '[]' }) => {
  const expandedArraysPaths = [];

  for (let pathIdx = 0; pathIdx < paths.length; pathIdx += 1) {
    const initialPath = paths[pathIdx];
    const [leftPart] = initialPath.split(arraySymbol);

    if (leftPart === initialPath) {
      expandedArraysPaths.push(initialPath);
      // eslint-disable-next-line no-continue
      continue;
    }
    const arrayContent = _get(object, leftPart);
    const arrayLength = arrayContent && Array.isArray(arrayContent) ? arrayContent.length : 0;
    for (let elementIdx = 0; elementIdx < arrayLength; elementIdx += 1) {
      const expandedPath = initialPath.replace(`${leftPart}${arraySymbol}`, `${leftPart}[${elementIdx}]`);
      expandedArraysPaths.push(
        ...expandArraysPaths({ object, paths: [expandedPath], arraySymbol })
      );
    }
  }

  return expandedArraysPaths;
};

module.exports = {
  expandArraysPaths,
};
