/**
 * convert.spec.js
 * (C) 2019 Allion Benjamin, Benbrahim Rayed
 * MIT LICENCE
 */

const { logger } = require('../config/logger');

/**
 * Convert each specified json object path from single object to array.
 * @param jsonObject - JsonObject to convert
 * @param paths - Can be an array or unique path value
 * @returns {object}
 */
const convert = (jsonObject, paths) => {
  let jsonToConvert = { ...jsonObject };
  const pathsToConvert = (typeof paths === 'string') ? [paths] : paths;

  pathsToConvert.forEach((path) => {
    logger.log('debug', "[convertSingleToArray] Try to convert '%s' to array", path);
    jsonToConvert = _convert(jsonToConvert, path);
  });
  return jsonToConvert;
};

/**
 * Checks if Json object field that should be an array.
 * Transform single objects to array where it's needed.
 * @param jsonObject - json object to convert
 * @param path - json path of object that must be an array
 * @returns {object}
 */
const _convert = (jsonObject, path) => {
  logger.log('debug', '[convertSingleToArray] Json object conversion method called for %s', path);
  logger.log('debug', '[convertSingleToArray] Current JSON to Transform : %j', jsonObject);

  const pathFields = path.split('.');
  const currentField = pathFields[0]; // Ex: return 'field1' for 'field1.field2.*.field4'
  const jsonResult = { ...jsonObject };
  // If json to convert doesn't contain current field property -> Don't convert anything
  if (!jsonResult[currentField]) {
    logger.log('debug', "[convertSingleToArray] Field doesn't exists : %s", path);
    return jsonResult;
  }

  const nextField = pathFields[1] || null; // Ex: return 'field2' for 'field1.field2.*'
  const currentFieldIsArray = (pathFields[1] === '*'); // Ex: 'field2.*' -> true

  /* If the current field is an array (ex: 'field2.*') and we must convert a child property :
       Ex.: 'field2.*.field4.field5'
       In that case, we must convert all array entries */
  if (currentFieldIsArray) {
    logger.log('debug', "[convertSingleToArray] Current field to transform '%s' is an array.", currentField);
    const nextPath = path.substr(path.indexOf('*.') + 2);
    jsonResult[currentField].forEach((arrayEntry, index) => {
      logger.log('debug', "[convertSingleToArray] Recursive call for '%s[%i]' -> '%s'", currentField, index, nextPath);
      jsonResult[currentField][index] = convert(
        jsonResult[currentField][index], nextPath,
      );
    });
    return jsonResult;
  }

  /* If the path has next field(s) (ex: ['field2','field3'] for 'field1.field2.field3')
     * We must call the method recursively for the next path ('field2.field3' path for ex.) */
  if (nextField !== null) {
    const nextPath = path.substr(path.indexOf('.') + 1);
    logger.log('debug', "[convertSingleToArray] Recursive call for '%s' -> '%s'", currentField, nextPath);
    jsonResult[currentField] = convert(jsonResult[currentField], nextPath);
  } else {
    logger.log('debug', '[convertSingleToArray] Convert Json Object %s to Array !', currentField);
    jsonResult[currentField] = !Array.isArray(jsonResult[currentField])
      ? [jsonResult[currentField]] : jsonResult[currentField];
  }

  console.log('debug', '[convertSingleToArray] Conversion complete : %j', jsonResult);
  return jsonResult;
};

module.exports = {
  convert,
};
