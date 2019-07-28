const { deReferenceSchema, _getFieldPaths, getFieldsToNormalize } = require('../../../../lib/core/schema');
const { schemaWithRef } = require('../../mock-sample/json-schema');

describe('schema.js', () => {
  it('try to dereference a Json Schema', async () => {
    const schemaWithoutRef = await deReferenceSchema(schemaWithRef);
    expect(schemaWithRef.properties.vegetables.items).not.toHaveProperty('properties');
    expect(schemaWithRef.properties.vegetables.items).toHaveProperty('$ref');
    expect(schemaWithoutRef.properties.vegetables.items.properties).toHaveProperty('veggieName');
    expect(schemaWithoutRef.properties.vegetables.items.properties).toHaveProperty('veggieLike');
  });
});

describe('schema.js', () => {
  it('try to get all field types from Json Schema', async () => {
    const schemaWithoutRef = await deReferenceSchema(schemaWithRef);
    const typePaths = _getFieldPaths(schemaWithoutRef);
    expect(typePaths).toContainEqual('$.properties.fruits');
    expect(typePaths).toContainEqual('$.properties.vegetables');
    expect(typePaths).toContainEqual('$.properties.fruits.items');
    expect(typePaths).toContainEqual('$.properties.vegetables.items.properties.veggieName');
    expect(typePaths).toContainEqual('$.properties.vegetables.items.properties.veggieLike');
    expect(typePaths).not.toContainEqual('$.properties.other');
    expect(typePaths).not.toContainEqual('$');
    expect(typePaths).not.toContainEqual('$.definition.veggie');
    expect(typePaths).not.toContainEqual('$.definition.veggie.items.properties.veggieName');
  });
});

describe('schema.js', () => {
  it('try to get all fields that must be normalized from Json-Schema', async () => {
    const schemaWithoutRef = await deReferenceSchema(schemaWithRef);
    const fields = getFieldsToNormalize(schemaWithoutRef);

    expect(fields).toContainEqual({ path: '$.fruits', type: 'array' });
    expect(fields).toContainEqual({ path: '$.vegetables', type: 'array' });
    expect(fields).toContainEqual({ path: '$.vegetables[*].veggieName', type: 'string' });
    expect(fields).toContainEqual({ path: '$.vegetables[*].veggieLike', type: 'boolean' });
    expect(fields).not.toContainEqual({ path: '$.other', type: 'object' });
    expect(fields).not.toContainEqual({ path: '$', type: 'object' });
    expect(fields).not.toContainEqual({ path: '$.definition.veggie', type: 'object' });
    expect(fields).not.toContainEqual({ path: '$.definition.veggie.veggieName', type: 'string' });
  });
});
