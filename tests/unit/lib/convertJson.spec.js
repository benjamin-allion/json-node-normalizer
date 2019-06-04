const SingleToArray = require('../../../index')
const jsonSample = require('./mockData')

describe('convert.js', () => {
    it('simple field conversion \'root.subField\'', () => {
        // Given
        const jsonToConvert = { ...jsonSample };
        console.log(jsonToConvert);
        // When
        const result = SingleToArray.convert(jsonToConvert, 'root.subField');
        // Then
        expect(Array.isArray(result.root.subField)).toBe(true);
        expect(result.root.subField[0].mArrayProperty).toMatchObject({ value: 'TEST' });
    });
});

describe('convert.js', () => {
    it('try to convert field that is already an array \'root.subArray\'', () => {
        // Given
        const jsonToConvert = { ...jsonSample };
        // When
        const result = SingleToArray.convert(jsonToConvert, 'root.subArray');
        // Then
        expect(Array.isArray(result.root.subArray)).toBe(true);
        expect(result.root.subArray[0].mArrayProperty).toMatchObject({value: 'TEST'});
    });
});
