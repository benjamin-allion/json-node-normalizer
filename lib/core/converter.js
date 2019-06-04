/**
 * Json property converter class
 * MIT LICENCE
 */
const { logger } = require('../../config/logger');
const { convertJsonNode } = require('./types');

class NodeTypeConverter {
  /**
   * Converts json object fields/nodes (from path) to specified target type.
   * @param jsonObject - json object to convert
   * @param paths - can be an array or unique path value. (Ex: 'root.field.fieldToConvert')
   * @param type - target field/node type, see 'types.js'
   * @returns {object}
   */
  convert(jsonNode, paths, type) {
    let jsonResult = { ...jsonNode };
    const pathsArray = (typeof paths === 'string') ? [paths] : paths;

    pathsArray.forEach((path) => {
      logger.log('debug', `Start transformation of field(s) '${path}' to '${type}'`);
      jsonResult = this._convertNodeType(jsonResult, path, type);
    });
    return jsonResult;
  }

  /**
   * Transform the type of inner json object fields (from path).
   * @param jsonNode - json object to transform
   * @param path - json path of object that must be replaced
   * @param type - target field type, see 'types.js'
   * @returns {object}
   * @private
   */
  _convertNodeType(jsonNode, path, type) {
    const jsonResult = { ...jsonNode };
    logger.log('debug', `Json object conversion method called for ${path}`);
    logger.log('debug', `Current JSON to transform : ${JSON.stringify(jsonNode)}`);

    const fields = extractFields(path);
    const currentFieldNode = jsonResult[fields.current];
    // If json doesn't contain current field property -> Don't convert anything
    if (!currentFieldNode) {
      logger.log('debug', `Field doesn't exists : ${path}`);
      return jsonResult;
    }

    /* If the current field node is an array (ex: 'field2.*') and we must convert a child property :
         Ex.: 'field2.*.field4.field5'
         We must index all his inner array entries */
    if (fields.currentIsArray) {
      logger.log('debug', `Field '${fields.current}' is an array -> Transform children`);
      const nextPath = path.substr(path.indexOf('*.') + 2);
      currentFieldNode.forEach((arrayEntry, index) => {
        logger.log('debug', `Recursive call for '${fields.current}[${index}]' -> '${nextPath}'`);
        jsonResult[fields.current][index] = this._convertNodeType(
          currentFieldNode[index], nextPath, type
        );
      });
      return jsonResult;
    }

    /* If the path has next field(s) (ex: ['field2','field3'] for 'field1.field2.field3')
       * We must call the method recursively for the next path ('field2.field3' path for ex.) */
    if (fields.next !== null) {
      const nextPath = path.substr(path.indexOf('.') + 1);
      logger.log('debug', `Recursive call for '${fields.current}' -> '${nextPath}'`);
      jsonResult[fields.current] = this._convertNodeType(currentFieldNode, nextPath, type);
    } else {
      logger.log('debug', `Transform Json node type of '${fields.current}' to '${type}' !`);
      jsonResult[fields.current] = convertJsonNode(currentFieldNode, type);
    }

    logger.log('debug', `Conversion complete : ${JSON.stringify(jsonResult)}`);
    return jsonResult;
  }
}

/**
 * Method that return searched fields information from path
 * @param path - full path
 * @returns {object}
 */
const extractFields = (path) => {
  const pathFields = path.split('.');
  return {
    current: pathFields[0], // Ex: return 'field1' for 'field1.field2.*.field4'
    currentIsArray: (pathFields[1] === '*'), // Ex: 'field2.*' -> true
    next: pathFields[1] || null,
  };
};

module.exports = {
  NodeTypeConverter
};
