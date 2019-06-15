const deReferenceSchema = require('../../../../lib/core/schema');
const { schemaWithRef } = require('../../mock-sample/json-schema');

describe('converter.js', () => {
  it('try to dereference a Json Schema', async () => {
    const deRefSchema = await deReferenceSchema(schemaWithRef);
    expect(schemaWithRef.properties.vegetables.items).not.toHaveProperty('properties');
    expect(schemaWithRef.properties.vegetables.items).toHaveProperty('$ref');
    expect(deRefSchema.properties.vegetables.items.properties).toHaveProperty('veggieName');
    expect(deRefSchema.properties.vegetables.items.properties).toHaveProperty('veggieLike');
  });
});
0
