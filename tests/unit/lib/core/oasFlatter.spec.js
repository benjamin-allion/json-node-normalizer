/* eslint-disable global-require */
const JsonNodeNormalizer = require('../../../../index');

describe('oasFlatter.js', () => {
  it('try to convert oas2 basic example', () => {
    // Given
    const jsonSample = require('../../mock-sample/oas2_basic.json');
    const expected = require('../../mock-sample/oas2_basic_flattered.json');
    // When
    const oasFlattered = JsonNodeNormalizer.oasFlatten(jsonSample);
    // Then
    expect(oasFlattered).toEqual(expected);
  });

  it('try to convert oas3 basic example', () => {
    // Given
    const jsonSample = require('../../mock-sample/oas3_basic.json');
    const expected = require('../../mock-sample/oas3_basic_flattered.json');
    // When
    const oasFlattered = JsonNodeNormalizer.oasFlatten(jsonSample);
    // Then
    expect(oasFlattered).toEqual(expected);
  });

  it('try to convert oas3 with ref error example', () => {
    // Given
    const jsonSample = require('../../mock-sample/oas3_ref_error.json');
    const expected = require('../../mock-sample/oas3_ref_error_flattered.json');
    // When
    const oasFlattered = JsonNodeNormalizer.oasFlatten(jsonSample);
    // Then
    expect(oasFlattered).toEqual(expected);
  });

  it('try to convert oas3 with allOf & oneOf example', () => {
    // Given
    const jsonSample = require('../../mock-sample/oas3_allof_oneof.json');
    const expected = require('../../mock-sample/oas3_allof_oneof_flattered.json');
    // When
    const oasFlattered = JsonNodeNormalizer.oasFlatten(jsonSample);
    // Then
    expect(oasFlattered).toEqual(expected);
  });

  it('try to convert oas3 with allOf & anyOf example', () => {
    // Given
    const jsonSample = require('../../mock-sample/oas3_allOf_anyOf.json');
    const expected = require('../../mock-sample/oas3_allOf_anyOf_flattered.json');
    // When
    const oasFlattered = JsonNodeNormalizer.oasFlatten(jsonSample);
    // Then
    expect(oasFlattered).toEqual(expected);
  });
});

// describe('oasFlatter.js', () => {
//   it('try to normalize json data from json schema', async () => {
//     // Given
//     const jsonToNormalize = {
//       fields: {
//         id: 123,
//         name: 'my_name',
//         firstName: 'firstName',
//         age: '31',
//         phone: '33600000010',
//         orders: {
//           label: 'first_order'
//         },
//         active: 'true',
//       }
//     };
//     const jsonSchema = {
//       fields: {
//         type: 'object',
//         properties: {
//           id: {
//             type: 'string'
//           },
//           name: {
//             type: 'string'
//           },
//           firstName: {
//             type: 'string'
//           },
//           age: {
//             type: 'number'
//           },
//           phone: {
//             type: 'integer'
//           },
//           orders: {
//             type: 'array',
//             items: {
//               label: {
//                 type: 'string'
//               }
//             }
//           },
//           active: {
//             type: 'boolean'
//           },
//         }
//       }
//     };
//     // When
//     const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
//     // Then
//     expect(Array.isArray(result.fields.orders)).toBe(true);
//     expect(Number.isInteger(result.fields.age)).toBe(true);
//     expect(Number.isInteger(result.fields.phone)).toBe(true);
//     expect(typeof result.fields.id === 'string').toBe(true);
//     expect(typeof result.fields.active === 'boolean').toBe(true);
//   });

//   it('try to normalize json data that should not be normalized from json schema', async () => {
//     // Given
//     const jsonToNormalize = {
//       fields: {
//         id: '123',
//         name: 'my_name',
//         firstName: 'firstName',
//         age: 31,
//         phone: 33600000010,
//         orders: {
//           label: 'first_order'
//         },
//         active: true,
//         externalField: {
//           label: 'missing_param'
//         }
//       }
//     };
//     const jsonSchema = {
//       fields: {
//         type: 'object',
//         properties: {
//           id: {
//             type: 'string'
//           },
//           name: {
//             type: 'string'
//           },
//           firstName: {
//             type: 'string'
//           },
//           age: {
//             type: 'number'
//           },
//           phone: {
//             type: 'integer'
//           },
//           orders: {
//             type: 'array',
//             items: {
//               label: {
//                 type: 'string'
//               }
//             }
//           },
//           active: {
//             type: 'boolean'
//           },
//           externalField: {
//             type: 'null'
//           },
//         }
//       }
//     };
//     // When
//     const result = await JsonNodeNormalizer.normalize(jsonToNormalize, jsonSchema);
//     // Then
//     expect(Array.isArray(result.fields.orders)).toBe(true);
//     expect(Number.isInteger(result.fields.age)).toBe(true);
//     expect(Number.isInteger(result.fields.phone)).toBe(true);
//     expect(typeof result.fields.id === 'string').toBe(true);
//     expect(typeof result.fields.active === 'boolean').toBe(true);
//     expect(result.fields.externalField).toBe(null);
//   });

//   it('should normalize jsonData with specific normalization type field name (See #13)', async () => {
//     // Given
//     const jsonData = { data: { enable: 'true' } };
//     const jsonSchema = {
//       data: {
//         type: 'object',
//         properties: {
//           enable: {
//             normalization_type: 'boolean'
//           }
//         }
//       }
//     };
//     const config = {
//       fieldNames: {
//         type: 'normalization_type'
//       }
//     };
//     // When
//     const result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema, config);
//     // Then
//     expect(typeof result.data.enable).toBe('boolean');
//   });
// });
