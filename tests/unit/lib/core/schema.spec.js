const { deReferenceSchema, getAllFieldTypes } = require('../../../../lib/core/schema');
const { schemaWithRef } = require('../../mock-sample/json-schema');

describe('schema.js', () => {
  it('try to dereference a Json Schema', async () => {
    const deRefSchema = await deReferenceSchema(schemaWithRef);
    expect(schemaWithRef.properties.vegetables.items).not.toHaveProperty('properties');
    expect(schemaWithRef.properties.vegetables.items).toHaveProperty('$ref');
    expect(deRefSchema.properties.vegetables.items.properties).toHaveProperty('veggieName');
    expect(deRefSchema.properties.vegetables.items.properties).toHaveProperty('veggieLike');
  });
});

describe('schema.js', () => {
  it('try to get all field types from Json Schema', async () => {
    const typePaths = await getAllFieldTypes(schemaWithRef);
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
