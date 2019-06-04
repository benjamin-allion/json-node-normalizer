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

describe('convert.js', () => {
    it('try to convert an unknown field \'root.unknown\'', () => {
        // Given
        const jsonToConvert = { ...jsonSample };
        // When
        const result = SingleToArray.convert(jsonToConvert, 'root.unknown');
        // Then
        expect(result.root.unknown).not.toBeDefined();
    });
});

describe('convert.js', () => {
    it('property of array entries conversion \'root.subArray.*.mArrayProperty\'', () => {
        // Given
        const jsonToConvert = { ...jsonSample };
        // When
        let result = SingleToArray.convert(jsonToConvert, 'root.subArray');
        result = SingleToArray.convert(result, 'root.subArray.*.mArrayProperty');
        // Then
        expect(Array.isArray(result.root.subArray)).toBe(true);
        expect(result.root.subArray[0].mProperty).toBe('TEST');
        expect(Array.isArray(result.root.subArray[0].mArrayProperty)).toBe(true);
        expect(result.root.subArray[0].mArrayProperty[0].value).toBe('TEST');
    });
});

describe('convert.js', () => {
    it('property of array of array entries conversion (multiple sub-levels) \'root.subArray.*.mArrayProperty.*.values\'', () => {
        // Given
        const jsonToConvert = { ...jsonSample };
        // When
        let result = SingleToArray.convert(jsonToConvert, 'root.subArray');
        result = SingleToArray.convert(result, 'root.subArray.*.mArrayProperty');
        result = SingleToArray.convert(result, 'root.subArray.*.mArrayProperty.*.values');
        // Then
        expect(Array.isArray(result.root.subArray[0].mArrayProperty)).toBe(true);
        expect(Array.isArray(result.root.subArray[1].mArrayProperty)).toBe(true);
        expect(Array.isArray(result.root.subArray[2].mArrayProperty)).toBe(true);
        expect(Array.isArray(result.root.subArray[0].mArrayProperty[0].values)).toBe(false); // Doesn't contain 'values'
        expect(Array.isArray(result.root.subArray[1].mArrayProperty[0].values)).toBe(true);
    });
});
