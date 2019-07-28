const { FormatTypes, normalizeFormat } = require('../../../../lib/core/formats');

describe('formats.js', () => {
  it('try to normalize json node to \'UPPERCASE_FORMAT\'', async () => {
    // Given
    const jsonNode = 'test';
    const targetFormat = FormatTypes.UPPERCASE_FORMAT;

    // When
    const normalizedNode = normalizeFormat(jsonNode, targetFormat);

    // Then
    const expectedResult = 'TEST';
    expect(normalizedNode).toBe(expectedResult);
  });

  it('try to normalize json node to \'LOWERCASE_FORMAT\'', async () => {
    // Given
    const jsonNode = 'TEST';
    const targetFormat = FormatTypes.LOWERCASE_FORMAT;

    // When
    const normalizedNode = normalizeFormat(jsonNode, targetFormat);

    // Then
    const expectedResult = 'test';
    expect(normalizedNode).toBe(expectedResult);
  });
});
