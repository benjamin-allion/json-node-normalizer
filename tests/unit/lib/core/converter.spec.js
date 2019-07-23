const JsonNodeNormalizer = require('../../../../index');
const jsonSample = require('../../mock-sample/json');

describe('normalizer.js', () => {
  it('try to convert field to undefined type', () => {
    // Given
    let jsonToConvert = { ...jsonSample };
    const targetType = 'UNKNOW_TYPE';
    // When
    jsonToConvert = JsonNodeNormalizer.normalizePath(jsonToConvert, 'root.subField', targetType);
    // Then
    expect(jsonToConvert).toEqual(jsonSample);
  });
});

describe('normalizer.js', () => {
  it('try to normalize json data from json schema', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        id: 123,
        name: 'my_name',
        firstName: 'firstName',
        age: '31',
        phone: '33600000010',
        orders: {
          label: 'first_order'
        },
        active: 'true',
      }
    };
    const jsonSchema = {
      fields: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          firstName: {
            type: 'string'
          },
          age: {
            type: 'number'
          },
          phone: {
            type: 'integer'
          },
          orders: {
            type: 'array',
            items: {
              label: {
                type: 'string'
              }
            }
          },
          active: {
            type: 'boolean'
          },
        }
      }
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
    expect(Array.isArray(result.fields.orders)).toBe(true);
    expect(Number.isInteger(result.fields.age)).toBe(true);
    expect(Number.isInteger(result.fields.phone)).toBe(true);
    expect(typeof result.fields.id === 'string').toBe(true);
    expect(typeof result.fields.active === 'boolean').toBe(true);
  });
});

describe('normalizer.js', () => {
  it('try to normalize json data that should not be normalized from json schema', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        id: '123',
        name: 'my_name',
        firstName: 'firstName',
        age: 31,
        phone: 33600000010,
        orders: {
          label: 'first_order'
        },
        active: true,
        externalField: {
          label: 'missing_param'
        }
      }
    };
    const jsonSchema = {
      fields: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          firstName: {
            type: 'string'
          },
          age: {
            type: 'number'
          },
          phone: {
            type: 'integer'
          },
          orders: {
            type: 'array',
            items: {
              label: {
                type: 'string'
              }
            }
          },
          active: {
            type: 'boolean'
          },
          externalField: {
            type: 'null'
          },
        }
      }
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
    expect(Array.isArray(result.fields.orders)).toBe(true);
    expect(Number.isInteger(result.fields.age)).toBe(true);
    expect(Number.isInteger(result.fields.phone)).toBe(true);
    expect(typeof result.fields.id === 'string').toBe(true);
    expect(typeof result.fields.active === 'boolean').toBe(true);
    expect(result.fields.externalField).toBe(null);
  });
});
