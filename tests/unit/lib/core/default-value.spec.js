const JsonNodeNormalizer = require('../../../../index');

describe('normalizer.js', () => {
  it('Should normalize and add default values', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        id: 123,
        name: 'my_name',
        firstName: 'firstName',
        age: '31',
        phone: '33600000010',
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
            default: [],
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
    expect(Array.isArray(result.fields.orders))
      .toBe(true);
    expect(Number.isInteger(result.fields.age))
      .toBe(true);
    expect(Number.isInteger(result.fields.phone))
      .toBe(true);
    expect(typeof result.fields.id === 'string')
      .toBe(true);
    expect(typeof result.fields.active === 'boolean')
      .toBe(true);
  });
});
