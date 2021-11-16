const JsonNodeNormalizer = require('../../../../index');

describe('normalizer.js', () => {
  it('Should normalize and add default values if field is undefined', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        id: 123,
        name: 'my_name',
        firstName: 'firstName',
        addresses: [{
          enable: true,
          details: [
            {
              label: 'detail_without_notes'
            },
            {
              label: 'detail_with_notes',
              notes: [{ content: 'note_test' }]
            },
            {} // Empty object
          ]
        },
        {
          enable: false,
          details: [
            {
              label: 'detail_with_notes',
              notes: [{ content: 'note_test' }]
            },
            {
              label: 'detail_without_notes'
            }
          ]
        }
        ],
        active: false
      }
    };
    const emptyJsonToNormalize = {
      fields: {
        id: 123,
        name: 'my_name',
        firstName: 'firstName'
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
          addresses: {
            type: 'array',
            items: {
              details: {
                type: 'array',
                default: [],
                items: { $ref: '#/definitions/addressType' }
              },
              enable: {
                type: 'boolean',
              }
            }
          },
          active: {
            type: 'boolean',
            default: true
          },
        }
      },
      definitions: {
        addressType: {
          label: {
            type: 'string',
          },
          notes: {
            type: 'array',
            default: [], // Field that should be filled for our test case <!>
            items: {
              content: { type: 'string' }
            }
          }
        }
      }
    };

    // When
    const jsonNormalized = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
    const emptyJsonNormalized = await JsonNodeNormalizer.normalize(
      emptyJsonToNormalize, jsonSchema
    );

    // Then (jsonNormalized check)
    expect(Array.isArray(jsonNormalized.fields.addresses[0].details)).toBe(true);
    expect(Array.isArray(jsonNormalized.fields.addresses[0].details[0].notes)).toBe(true);
    expect(Array.isArray(jsonNormalized.fields.addresses[0].details[1].notes)).toBe(true);
    expect(Array.isArray(jsonNormalized.fields.addresses[0].details[2].notes)).toBe(true);
    expect(jsonNormalized.fields.addresses[0].details[0].notes).toStrictEqual([]);
    expect(jsonNormalized.fields.addresses[0].details[1].notes).toStrictEqual([{ content: 'note_test' }]);
    expect(jsonNormalized.fields.addresses[0].details[2].notes).toStrictEqual([]);
    expect(jsonNormalized.fields.addresses[1].details[0].notes).toStrictEqual([{ content: 'note_test' }]);
    expect(jsonNormalized.fields.addresses[1].details[1].notes).toStrictEqual([]);

    expect(Number.isInteger(jsonNormalized.fields.age)).toBe(true);
    expect(jsonNormalized.fields.age).toEqual(21);
    expect(Number.isInteger(jsonNormalized.fields.phone)).toBe(true);
    expect(jsonNormalized.fields.phone).toEqual(660328406);
    expect(typeof jsonNormalized.fields.id === 'string').toBe(true);
    expect(typeof jsonNormalized.fields.active === 'boolean').toBe(true);
    // Then (should keep field value and not set default)
    expect(jsonNormalized.fields.active).toBe(false);

    // Then (emptyJsonNormalized check)
    expect(emptyJsonNormalized.fields.addresses).toBeUndefined();
  });
});
