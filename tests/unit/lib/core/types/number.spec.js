const JsonNodeNormalizer = require('../../../../../index');
const { NodeTypes } = require('../../../../../lib/core/types');

describe('types.js', () => {
  it(`must convert 'String' to 'Number'`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: '123' };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePaths({ jsonNode: jsonToNormalize, paths: ['fieldToNormalize'], type: targetType });
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: 123 });
  });

  it(`must convert 'String' to 'Number' (Decimal Support)`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: '123.23' };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePaths({ jsonNode: jsonToNormalize, paths: ['fieldToNormalize'], type: targetType });
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: 123.23 });
  });

  it(`must convert 'String' to 'Number' (Decimal Support)`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: '123,23' };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePaths({ jsonNode: jsonToNormalize, paths: ['fieldToNormalize'], type: targetType });
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: 123.23 });
  });

  it(`must keep correct number value`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: 123 };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePaths({ jsonNode: jsonToNormalize, paths: ['fieldToNormalize'], type: targetType });
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: 123 });
  });

  it(`must keep correct number value (Decimal support)`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: 123.123 };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePaths({ jsonNode: jsonToNormalize, paths: ['fieldToNormalize'], type: targetType });
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: 123.123 });
  });

  it(`must convert object to NaN`, () => {
    // Given
    let jsonToNormalize = { fieldToNormalize: { impossibleToConvertToNumber: true } };
    const targetType = NodeTypes.NUMBER_TYPE;
    // When
    jsonToNormalize = JsonNodeNormalizer.normalizePaths({ jsonNode: jsonToNormalize, paths: ['fieldToNormalize'], type: targetType });
    // Then
    expect(jsonToNormalize).toEqual({ fieldToNormalize: NaN });
  });
});
