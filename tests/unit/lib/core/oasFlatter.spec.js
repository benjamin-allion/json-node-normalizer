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
