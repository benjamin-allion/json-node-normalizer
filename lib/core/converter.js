/**
 * Json property converter class
 * (C) 2019 Allion Benjamin, Benbrahim Rayed
 * MIT LICENCE
 */
const { logger } = require('../../config/logger');

const ConversionTypes = {
  ARRAY_TYPE: 'array_type',
}

class JsonPropertyConverter {
  /**
   * Converts json object fields (from path) to specified target type.
   * @param jsonObject - json object to convert
   * @param paths - can be an array or unique path value. (Ex: 'root.field.fieldToConvert')
   * @returns {object}
   */
  convert(jsonObject, paths, type) {
    let jsonResult = { ...jsonObject };
    const pathsArray = (typeof paths === 'string') ? [paths] : paths;

    pathsArray.forEach((path) => {
      logger.log('debug', `Try to convert '${path}' to '${type}'`);
      jsonResult = this._convert(jsonResult, path, type);
    });
    return jsonResult;
  }

  /**
   * Replaces the type of inner json object fields (from path).
   * @param jsonObject - json object to convert
   * @param path - json path of object that must be replaced
   * @param type - target object type
   * @returns {object}
   */
  _convert(jsonObject, path, type) {
    const jsonResult = { ...jsonObject };
    logger.log('debug', `Json object conversion method called for ${path}`);
    logger.log('debug', `Current JSON to Transform : ${JSON.stringify(jsonObject)}`);

    const fields = this._extractFields(path);
    const jsonNode = jsonResult[fields.current];
    // If json to index doesn't contain current field property -> Don't index anything
    if (!jsonNode) {
      logger.log('debug', `Field doesn't exists : ${path}`);
      return jsonResult;
    }

    /* If the current field is an array (ex: 'field2.*') and we must index a child property :
         Ex.: 'field2.*.field4.field5'
         In that case, we must index all array entries */
    if (fields.currentIsArray) {
      logger.log('debug', `Current field to transform '${fields.current}' is an array.`);
      const nextPath = path.substr(path.indexOf('*.') + 2);
      jsonNode.forEach((arrayEntry, index) => {
        logger.log('debug', `Recursive call for '${fields.current}[${index}]' -> '${nextPath}'`);
        jsonResult[fields.current][index] = this._convert(jsonNode[index], nextPath, type);
      });
      return jsonResult;
    }

    /* If the path has next field(s) (ex: ['field2','field3'] for 'field1.field2.field3')
       * We must call the method recursively for the next path ('field2.field3' path for ex.) */
    if (fields.next !== null) {
      const nextPath = path.substr(path.indexOf('.') + 1);
      logger.log('debug', `Recursive call for '${fields.current}' -> '${nextPath}'`);
      jsonResult[fields.current] = this._convert(jsonNode, nextPath, type);
    } else {
      logger.log('debug', `Convert Json Object ${fields.current} to ${type} !`);
      jsonResult[fields.current] = this._convertJsonNode(jsonNode, type);
    }

    logger.log('debug', `Conversion complete : ${JSON.stringify(jsonResult)}`);
    return jsonResult;
  }

  /**
   * Method that return searched fields information from path
   * @param path - full path
   * @returns {object}
   * @private
   */
  _extractFields(path) {
    const pathFields = path.split('.');
    return {
      current: pathFields[0], // Ex: return 'field1' for 'field1.field2.*.field4'
      currentIsArray: (pathFields[1] === '*'), // Ex: 'field2.*' -> true
      next: pathFields[1] || null,
    };
  }

  /**
   * Method that convert json object type by another one.
   * Ex: - Replace single json object to json object array (ARRAY_TYPE)
   * See ConversionTypes for conversion types.
   * @param jsonNode - json node to convert
   * @param type - target type
   * @private
   */
  _convertJsonNode(jsonNode, type) {
    switch (type) {
      // Convert single json object to json object array
      case ConversionTypes.ARRAY_TYPE:
        return !Array.isArray(jsonNode) ? [jsonNode] : jsonNode;
      default:
    }
    return jsonNode;
  }
}

module.exports = {
  JsonPropertyConverter,
  ConversionTypes,
}
