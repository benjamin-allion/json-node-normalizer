/* eslint-disable no-await-in-loop */
const SchemaCache = require('../../../../lib/core/schemaCache');
const { FormatTypes } = require('../../../../lib/core/formats');
const JsonNodeNormalizer = require('../../../../index');

/**
 * Async function that will be resolved after "ms" time
 * @param {number} ms
 * @returns {Promise}
 */
const sleepy = ms => new Promise(resolve => { setTimeout(() => resolve(), ms); });

describe('schemaCache.js', () => {
  it('should store object data into the cache', async () => {
    // Given
    const objectToStore = {
      test: "OK"
    };

    // When
    SchemaCache.setData('objectTest', objectToStore, 200);
    SchemaCache.setData('objectTest', objectToStore, 20); // Second setData should be ignored
    await sleepy(100);

    // Then
    expect(SchemaCache.getData('objectTest')).toEqual(objectToStore);
    await sleepy(200); // Wait for cache clear
  });

  it('should remove object from cache after delay', async () => {
    // Given
    const objectToStore = {
      test: "OK"
    };

    // When
    SchemaCache.setData('objectTest', objectToStore, 500);
    await sleepy(600);

    // Then
    expect(SchemaCache.getData('objectTest')).toEqual(undefined);
  });

  it(`'fieldsToNormalize' should be store & removed from the cache`, async () => {
    // Given
    const cacheSpy = jest.spyOn(SchemaCache, 'setData');
    const jsonData = {
      data: {
        enable: 'true',
        lastName: 'must_be_uppercase',
        firstName: 'MUST_BE_LOWERCASE',
      }
    };
    const jsonSchema = {
      schemaName: "1233487",
      data: {
        type: 'object',
        properties: {
          enable: {
            type: 'boolean'
          },
          lastName: {
            type: 'string',
            format: FormatTypes.UPPERCASE
          },
          firstName: {
            type: 'string',
            format: FormatTypes.LOWERCASE
          },
        }
      }
    };
    const customConfig = {
      useCache: true,
      cacheId: "schemaName",
      cacheDuration: 800
    };

    // When
    let result;
    for (let i = 0; i < 5; i += 1) {
      result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema, customConfig);
    }
    await sleepy(900); // Invalid cache

    for (let i = 0; i < 5; i += 1) {
      result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema, customConfig);
    }

    // Then
    const expectedResult = {
      data: {
        enable: true,
        lastName: 'MUST_BE_UPPERCASE',
        firstName: 'must_be_lowercase',
      }
    };
    expect(result).toStrictEqual(expectedResult);
    expect(cacheSpy).toHaveBeenCalledTimes(2);
    await sleepy(900); // Wait for cache clear
    jest.clearAllMocks();
  });

  it(`Should clear cache between each calls`, async () => {
    // Given
    const cacheSpy = jest.spyOn(SchemaCache, 'setData');
    const jsonData = {
      data: {
        enable: 'true',
        lastName: 'must_be_uppercase',
        firstName: 'MUST_BE_LOWERCASE',
      }
    };
    const jsonSchema = {
      schemaName: "1233489",
      data: {
        type: 'object',
        properties: {
          enable: {
            type: 'boolean'
          },
          lastName: {
            type: 'string',
            format: FormatTypes.UPPERCASE
          },
          firstName: {
            type: 'string',
            format: FormatTypes.LOWERCASE
          },
        }
      }
    };
    const customConfig = {
      useCache: true,
      cacheId: "schemaName",
      cacheDuration: 200
    };

    // When
    let result;
    for (let i = 0; i < 5; i += 1) {
      result = await JsonNodeNormalizer.normalize(jsonData, jsonSchema, customConfig);
      JsonNodeNormalizer.clearCache();
    }

    // Then
    const expectedResult = {
      data: {
        enable: true,
        lastName: 'MUST_BE_UPPERCASE',
        firstName: 'must_be_lowercase',
      }
    };
    expect(result).toStrictEqual(expectedResult);
    expect(cacheSpy).toHaveBeenCalledTimes(5);
    await sleepy(200); // Wait for cache clear
    jest.clearAllMocks();
  });
});
