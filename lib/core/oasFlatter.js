/* eslint-disable no-param-reassign */
const _ = require('lodash');

const { logger } = require('../../config/logger');

/**
 * Method that will flatten definition/schema of an open api specfication V2 or V3.
 * It replace "$ref" by the full object
 * @param specOas - open api specfication json object to flatten
 * @returns {object}
 */
const oasFlatten = (specOas) => {
  // We want preserve the original specOas
  const newSpec = _.cloneDeep(specOas);

  let definitions;

  // openApi V2
  if (newSpec && newSpec.definitions) {
    definitions = newSpec.definitions;
  }

  // openApi V3.x
  if (newSpec && newSpec.components && newSpec.components.schemas) {
    definitions = newSpec.components.schemas;
  }

  flatten(definitions, newSpec, '/');
  return newSpec;
};

function flatten(definitions, obj, path) {
  if (obj && obj.allOf && Array.isArray(obj.allOf)) {
    obj.type = 'object';
    obj.properties = {};
    Object.keys(obj.allOf).forEach((i) => {
      if (obj.allOf[i].$ref) {
        obj.$ref = obj.$ref || [];
        obj.$ref.push(obj.allOf[i].$ref);
      } else {
        Object.keys(obj.allOf[i]).forEach((j) => {
          if (typeof obj[j] === 'object' && obj[j].constructor === Object) {
            obj[j] = _.merge(obj[j], obj.allOf[i][j]);
          } else if (Array.isArray(obj[j])) {
            obj[j] = _.union(obj[j], obj.allOf[i][j]);
          } else {
            obj[j] = obj.allOf[i][j];
          }
        });
      }
    });
    delete obj.allOf;
  } else if (obj && obj.oneOf && Array.isArray(obj.oneOf)) {
    obj.type = 'object';
    obj.properties = {};
    Object.keys(obj.oneOf).forEach((i) => {
      if (obj.oneOf[i].$ref) {
        obj.$ref = obj.$ref || [];
        obj.$ref.push(obj.oneOf[i].$ref);
      } else {
        Object.keys(obj.oneOf[i]).forEach((j) => {
          if (typeof obj[j] === 'object' && obj[j].constructor === Object) {
            obj[j] = _.merge(obj[j], obj.oneOf[i][j]);
          } else if (Array.isArray(obj[j])) {
            obj[j] = _.union(obj[j], obj.oneOf[i][j]);
          } else {
            obj[j] = obj.oneOf[i][j];
          }
        });
      }
    });
    delete obj.oneOf;
  } else if (obj && obj.anyOf && Array.isArray(obj.anyOf)) {
    obj.type = 'object';
    obj.properties = {};
    Object.keys(obj.anyOf).forEach((i) => {
      if (obj.anyOf[i].$ref) {
        obj.$ref = obj.$ref || [];
        obj.$ref.push(obj.anyOf[i].$ref);
      } else {
        Object.keys(obj.anyOf[i]).forEach((j) => {
          if (typeof obj[j] === 'object' && obj[j].constructor === Object) {
            obj[j] = _.merge(obj[j], obj.anyOf[i][j]);
          } else if (Array.isArray(obj[j])) {
            obj[j] = _.union(obj[j], obj.anyOf[i][j]);
          } else {
            obj[j] = obj.anyOf[i][j];
          }
        });
      }
    });
    delete obj.anyOf;
  }

  if (obj && typeof obj.$ref === 'string') {
    obj.$ref = [obj.$ref];
  }

  if (obj && Array.isArray(obj.$ref)) {
    obj.$ref.forEach((val) => {
      const a = val.replace('#/definitions/', '').replace('#/components/schemas/', '');
      if (definitions[a]) {
        Object.keys(definitions[a]).forEach((j) => {
          if (typeof obj[j] === 'object' && obj[j].constructor === Object) {
            obj[j] = _.merge(obj[j], definitions[a][j]);
          } else if (Array.isArray(obj[j])) {
            obj[j] = _.union(obj[j], definitions[a][j]);
          } else {
            obj[j] = definitions[a][j];
          }
        });
      }
    });
    delete obj.$ref;
    flatten(definitions, obj, path);
  }

  Object.keys(obj).forEach((i) => {
    if (Array.isArray(obj[i]) || (typeof obj[i] === 'object' && obj[i].constructor === Object)) {
      logger.debug(`${path}/${i}`);
      flatten(definitions, obj[i], `${path}/${i}`);
    }
  });
}

module.exports = {
  oasFlatten
};
