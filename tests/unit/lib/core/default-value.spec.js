const JsonNodeNormalizer = require('../../../../index');

describe('normalizer.js', () => {
  it('Should normalize and add default values', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        id: 123,
        name: 'my_name',
        firstName: 'firstName',
        addresses: [
          {
            enable: true,
            details: [
              { label: 'test' }
            ]
          }
        ]
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
            type: 'number',
            default: '21'
          },
          phone: {
            type: 'integer',
            default: '0660328406'
          },
          orders: {
            type: 'array',
            default: [{
              enable: true
            }],
            items: {
              labels: {
                type: 'array',
                default: [],
              },
              enable: {
                type: 'boolean'
              }
            }
          },
          addresses: {
            type: 'array',
            items: {
              details: {
                type: 'array',
                default: [],
                items: {
                  label: {
                    type: 'string',
                  },
                  notes: {
                    type: 'array',
                    default: []
                  }
                }
              },
              enable: {
                type: 'boolean'
              }
            }
          },
          active: {
            type: 'boolean',
            default: true
          },
        }
      }
    };

    // When
    const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);

    // Then
    expect(Array.isArray(result.fields.orders))
      .toBe(true);
    expect(Array.isArray(result.fields.orders[0].labels))
      .toBe(true);
    expect(Array.isArray(result.fields.addresses[0].details))
      .toBe(true);
    expect(Array.isArray(result.fields.addresses[0].details[0].notes))
      .toBe(true);
    expect(Number.isInteger(result.fields.age))
      .toBe(true);
    expect(result.fields.age)
      .toEqual(21);
    expect(Number.isInteger(result.fields.phone))
      .toBe(true);
    expect(result.fields.phone)
      .toEqual(660328406);
    expect(typeof result.fields.id === 'string')
      .toBe(true);
    expect(typeof result.fields.active === 'boolean')
      .toBe(true);
  });
});
