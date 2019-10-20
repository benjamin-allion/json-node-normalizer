const JsonNodeNormalizer = require('../../../../index');
const { NodeTypes } = require('../../../../lib/core/types');

describe('types.js', () => {
  it(`must convert 'String' to 'Number'`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: '123' };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePath(jsonToNormalize, 'fieldToNormalize', targetType);
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: 123 });
  });
});
