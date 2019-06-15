const { deReferenceSchema, getFieldPaths, getFieldsToNormalize } = require('../../../../lib/core/schema');
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
    const typePaths = getFieldPaths(schemaWithoutRef);
    expect(typePaths).toContainEqual('$.properties.fruits');
    expect(typePaths).toContainEqual('$.properties.vegetables');
    expect(typePaths).toContainEqual('$.properties.fruits.items');
    expect(typePaths).toContainEqual('$.properties.vegetables.items.properties.veggieName');
    expect(typePaths).toContainEqual('$.properties.vegetables.items.properties.veggieLike');
    expect(typePaths).not.toContainEqual('$.properties.other');
    expect(typePaths).not.toContainEqual('$');
    expect(typePaths).not.toContainEqual('$.definition.veggie');
    expect(typePaths).not.toContainEqual('$.definition.veggie.properties.veggieName');
  });
});

describe('schema.js', () => {
  it('try to get all fields that must be normalized from Json-Schema', async () => {
    const schemaWithoutRef = await deReferenceSchema(schemaWithRef);
    const fields = getFieldsToNormalize(schemaWithoutRef);

    expect(fields).toContainEqual({ path: '$.properties.fruits', type: 'array' });
    expect(fields).toContainEqual({ path: '$.properties.vegetables', type: 'array' });
    expect(fields).toContainEqual({ path: '$.properties.fruits.items', type: 'string' });
    expect(fields).toContainEqual({ path: '$.properties.vegetables.items.properties.veggieName', type: 'string' });
    expect(fields).toContainEqual({ path: '$.properties.vegetables.items.properties.veggieLike', type: 'boolean' });
    expect(fields).not.toContainEqual({ path: '$.properties.other', type: 'object' });
    expect(fields).not.toContainEqual({ path: '$', type: 'object' });
    expect(fields).not.toContainEqual({ path: '$.definition.veggie', type: 'object' });
    expect(fields).not.toContainEqual({ path: '$.definition.veggie.properties.veggieName', type: 'string' });
  });
});
