const JsonNodeNormalizer = require('../../../../index');

describe('normalizer.js', () => {
  it('try to normalize json data to string', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        stringValue: 'OK',
        numberValue: 2,
        arrayValue: ['12'],
        booleanValue: true,
        objectWithToString: {
          toString: () => 'OK'
        },
        objectWithoutToString: {
          firstName: 'TEST',
          lastName: 'TEST',
        },
        emptyObject: {},
        nullObject: null,
        undefinedObject: undefined
      }
    };
    const jsonSchema = {
      fields: {
        type: 'object',
        properties: {
          stringValue: {
            type: 'string'
          },
          numberValue: {
            type: 'string'
          },
          arrayValue: {
            type: 'string'
          },
          booleanValue: {
            type: 'string'
          },
          objectWithToString: {
            type: 'string'
          },
          objectWithoutToString: {
            type: 'string'
          },
          emptyObject: {
            type: 'string'
          },
          nullObject: {
            type: 'string'
          },
          undefinedObject: {
            type: 'string'
          }
        }
      }
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
    // Then
    expect(typeof result.fields.stringValue === 'string')
      .toBe(true);
    expect(typeof result.fields.numberValue === 'string')
      .toBe(true);
    expect(typeof result.fields.arrayValue === 'string')
      .toBe(true);
    expect(typeof result.fields.booleanValue === 'string')
      .toBe(true);
    expect(typeof result.fields.objectWithToString === 'string')
      .toBe(true);
    expect(typeof result.fields.objectWithoutToString === 'string')
      .toBe(true);
    expect(typeof result.fields.emptyObject === 'string')
      .toBe(true);
    expect(typeof result.fields.nullObject === 'object')
      .toBe(true);
    expect(typeof result.fields.undefinedObject === 'undefined')
      .toBe(true);

    expect(result.fields.stringValue).toEqual('OK');
    expect(result.fields.numberValue).toEqual('2');
    expect(result.fields.arrayValue).toEqual(`["12"]`);
    expect(result.fields.booleanValue).toEqual('true');
    expect(result.fields.objectWithToString).toEqual('OK');
    expect(result.fields.objectWithoutToString).toEqual(`{"firstName":"TEST","lastName":"TEST"}`);
    expect(result.fields.emptyObject).toEqual('');
    expect(result.fields.nullObject).toEqual(null);
    expect(result.fields.undefinedObject).toEqual(undefined);
  });
});
