const JsonNodeNormalizer = require('../../../../index');
const jsonSample = require('../../mock-sample/json');
const { FormatTypes } = require('../../../../lib/core/formats');
const { NodeTypes } = require('../../../../lib/core/types');

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
    // Then
    expect(Array.isArray(result.fields.orders)).toBe(true);
    expect(Number.isInteger(result.fields.age)).toBe(true);
    expect(Number.isInteger(result.fields.phone)).toBe(true);
    expect(typeof result.fields.id === 'string').toBe(true);
    expect(typeof result.fields.active === 'boolean').toBe(true);
  });

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
    // Then
    expect(Array.isArray(result.fields.orders)).toBe(true);
    expect(Number.isInteger(result.fields.age)).toBe(true);
    expect(Number.isInteger(result.fields.phone)).toBe(true);
    expect(typeof result.fields.id === 'string').toBe(true);
    expect(typeof result.fields.active === 'boolean').toBe(true);
    expect(result.fields.externalField).toBe(null);
  });

  it('should normalize jsonData with specific normalization type field name (See #13)', async () => {
    // Given
    const jsonData = { data: { enable: 'true' } };
    const jsonSchema = {
      data: {
        type: 'object',
        properties: {
          enable: {
            normalization_type: 'boolean'
          }
        }
      }
    };
    const config = {
      typeFieldName: 'normalization_type'
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema, config);
    // Then
    expect(typeof result.data.enable).toBe('boolean');
  });

  it('should normalize jsonData with specific normalization format field name (See #19)', async () => {
    // Given
    const jsonData = {
      data: {
        lastName: 'must_be_uppercase',
        firstName: 'MUST_BE_LOWERCASE',
      }
    };
    const jsonSchema = {
      data: {
        type: 'object',
        properties: {
          lastName: {
            type: 'string',
            normalization_format: FormatTypes.UPPERCASE
          },
          firstName: {
            type: 'string',
            normalization_format: FormatTypes.LOWERCASE
          },
        }
      }
    };
    const config = {
      formatFieldName: 'normalization_format'
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema, config);
    // Then
    const expectedResult = {
      data: {
        lastName: 'MUST_BE_UPPERCASE',
        firstName: 'must_be_lowercase',
      }
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should normalize jsonData from JsonSchema with type & format definitions', async () => {
    // Given
    const jsonData = {
      data: {
        enable: 'true',
        lastName: 'must_be_uppercase',
        firstName: 'MUST_BE_LOWERCASE',
      }
    };
    const jsonSchema = {
      data: {
        type: 'object',
        properties: {
          enable: {
            type: 'boolean'
          },
          lastName: {
            type: 'string',
            format: FormatTypes.UPPERCASE
          },
          firstName: {
            type: 'string',
            format: FormatTypes.LOWERCASE
          },
        }
      }
    };
    // When
    const result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema);
    // Then
    const expectedResult = {
      data: {
        enable: true,
        lastName: 'MUST_BE_UPPERCASE',
        firstName: 'must_be_lowercase',
      }
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should normalize jsonData from JsonPaths with type & format definitions', async () => {
    // Given
    const jsonData = {
      data: {
        enable: 'true',
        firstName: 'MUST_BE_LOWERCASE',
        lastName: 'must_be_uppercase',
      }
    };
    // When
    let result = await JsonNodeNormalizer.normalizePath(
      jsonData, '.enable', NodeTypes.BOOLEAN_TYPE
    );
    result = await JsonNodeNormalizer.normalizePath(
      result, '.lastName', NodeTypes.STRING_TYPE, FormatTypes.UPPERCASE
    );
    result = await JsonNodeNormalizer.normalizePath(
      result, '.firstName', NodeTypes.STRING_TYPE, FormatTypes.LOWERCASE
    );
    // Then
    const expectedResult = {
      data: {
        enable: true,
        lastName: 'MUST_BE_UPPERCASE',
        firstName: 'must_be_lowercase',
      }
    };
    expect(result).toStrictEqual(expectedResult);
  });
});
