const NodeTypeConverter = require('../../../../index');
const jsonSample = require('../../mock-sample/json');

describe('converter.js', () => {
  it('try to convert field to undefined type', () => {
    // Given
    let jsonToConvert = { ...jsonSample };
    const targetType = 'UNKNOW_TYPE';
    // When
    jsonToConvert = NodeTypeConverter.convertFromPath(jsonToConvert, 'root.subField', targetType);
    // Then
    expect(jsonToConvert).toEqual(jsonSample);
  });
});

describe('converter.js', () => {
  it('try to normalize json data from json schema', async () => {
    // Given
    const jsonToNormalize = {
      fields: {
        id: 123,
        name: 'my_name',
        firstName: 'firstName',
        age: '31',
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
    const result = await NodeTypeConverter.convert(jsonToNormalize, jsonSchema);
    expect(Array.isArray(result.fields.orders)).toBe(true);
    expect(Number.isInteger(result.fields.age)).toBe(true);
    expect(typeof result.fields.id === 'string').toBe(true);
    expect(typeof result.fields.active === 'boolean').toBe(true);
  });
});
