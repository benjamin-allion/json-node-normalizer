const { FormatTypes, normalizeFormat } = require('../../../../lib/core/formats');

class UnknownType {
  constructor(value) {
    this.value = value;
  }
}

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

  it('try to normalize json node to unknown format', async () => {
    // Given
    const jsonNode = 'TEST';
    const targetFormat = 'unknown';

    // When
    const normalizedNode = normalizeFormat(jsonNode, targetFormat);

    // Then
    expect(normalizedNode).toBe(jsonNode);
  });

  it('try to normalize unknown json type object that cannot be formatted', async () => {
    // Given
    const jsonNode = new UnknownType('TEST');
    const targetFormat = FormatTypes.LOWERCASE_FORMAT;

    // When
    const normalizedNode = normalizeFormat(jsonNode, targetFormat);

    // Then
    expect(typeof normalizedNode).toBe('object');
    expect(normalizedNode).toBe(jsonNode);
  });
});
