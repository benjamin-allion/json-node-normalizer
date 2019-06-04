const { JsonPropertyConverter} = require('../../../../index');
const jsonSample = require('./mockData');

describe('converter.js', () => {
  it('try to convert field to undefined type', () => {
    // Given
    const jsonToConvert = { ...jsonSample };
    const targetType = 'UNKNOW_TYPE';
    // When
    const result = JsonPropertyConverter.convert(jsonToConvert, 'root.subField', targetType);
    // Then
    expect(jsonToConvert).toEqual(jsonSample);
  });
});
