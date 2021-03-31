const JsonNodeNormalizer = require('../../../../index');

describe('normalizer.js', () => {
  it('try to normalize json data with some boolean values', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        boolTrueFromString: 'true',
        boolFalseFromString: 'false',
        boolTrueFromUpperCaseString: 'TRUE',
        boolFalseFromUpperCaseString: 'FALSE',
        boolTrueFromInteger: 1,
        boolFalseFromInteger: 0,
        boolTrue: true,
        boolFalse: false
      }
    };
    const jsonSchema = {
      fields: {
        type: 'object',
        properties: {
          boolTrueFromString: {
            type: 'boolean'
          },
          boolFalseFromString: {
            type: 'boolean'
          },
          boolTrueFromUpperCaseString: {
            type: 'boolean'
          },
          boolFalseFromUpperCaseString: {
            type: 'boolean'
          },
          boolTrueFromInteger: {
            type: 'boolean'
          },
          boolFalseFromInteger: {
            type: 'boolean'
          },
          boolTrue: {
            type: 'boolean'
          },
          boolFalse: {
            type: 'boolean'
          }
        }
      }
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
    // Then
    expect(typeof result.fields.boolTrueFromString === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolTrueFromUpperCaseString === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolFalseFromString === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolFalseFromUpperCaseString === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolTrueFromInteger === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolFalseFromInteger === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolTrue === 'boolean')
      .toBe(true);
    expect(typeof result.fields.boolFalse === 'boolean')
      .toBe(true);
    expect(result.fields.boolTrueFromString).toEqual(true);
    expect(result.fields.boolFalseFromString).toEqual(false);
    expect(result.fields.boolTrueFromUpperCaseString).toEqual(true);
    expect(result.fields.boolFalseFromUpperCaseString).toEqual(false);
    expect(result.fields.boolTrueFromInteger).toEqual(true);
    expect(result.fields.boolFalseFromInteger).toEqual(false);
    expect(result.fields.boolTrue).toEqual(true);
    expect(result.fields.boolFalse).toEqual(false);
  });
});
