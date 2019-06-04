
const ConversionTypes = {
  ARRAY_TYPE: 'array_type',
};

/**
 * Method that convert json object type by another one.
 * Ex: - Replace single json object to json object array (ARRAY_TYPE)
 * See 'ConversionTypes'.
 * @param jsonNode - json node to convert
 * @param type - target type
 */
const convertJsonNode = (jsonNode, type) => {
  switch (type) {
    // Convert single json object to json object array
    case ConversionTypes.ARRAY_TYPE:
      return !Array.isArray(jsonNode) ? [jsonNode] : jsonNode;
    default:
  }
  return jsonNode;
};

module.exports = {
  ConversionTypes,
  convertJsonNode
};
