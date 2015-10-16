import Property from 'ember-json-schema/models/property';
import { module, test } from 'qunit';

export const propertyFixture = {
  'id': 'http://jsonschema.net/address',
  'type': 'object',
  'properties': {
    'streetAddress': {
      'id': 'http://jsonschema.net/address/streetAddress',
      'type': 'string'
    },
    'city': {
      'id': 'http://jsonschema.net/address/city',
      'type': 'string'
    },
    'state': {
      'id': 'http://jsonschema.net/address/city',
      'type': 'string',
      'enum': ['NY', 'IN']
    }
  },
  'required': [
    'streetAddress',
    'city'
  ]
};

let property;
module('models/property', {
  beforeEach() {
    property = new Property(propertyFixture);
  }
});

test('accepts a property definition to constructor', function(assert) {
  assert.ok(property, 'can create a property');
  assert.equal(property._property, propertyFixture, 'keeps track of raw property');
});

test('throws an error if schema is not provided to constructor', function(assert) {
  assert.throws(function() {
    new Property();
  }, /You must provide a property definition to the Property constructor./);
});

test('accessing properties returns a list of properties', function(assert) {
  let propertyKeys = Object.keys(property.properties);

  assert.deepEqual(['streetAddress', 'city', 'state'], propertyKeys, 'known keys are present');
});

test('accessing properties returns an instance of `Property` model', function(assert) {
  assert.ok(property.properties.streetAddress instanceof Property, 'streetAddress is an instance of Property');
  assert.ok(property.properties.city instanceof Property, 'city is an instance of Property');

  assert.equal(property.properties.streetAddress.type, 'string');
  assert.equal(property.properties.city.type, 'string');
});

test('can create a default value for an object', function(assert) {
  assert.deepEqual(property.buildDefaultValue(), {}, 'defaultValue returns an object if property type is object');
});

test('can create a default value for an object', function(assert) {
  property = new Property({
    'id': 'http://jsonschema.net/address/streetAddress',
    'type': 'array',
    'items': {
      type: 'object',
      properties: { }
    }
  });

  assert.deepEqual(property.buildDefaultValue(), [], 'defaultValue returns an array if property type is array');
});

test('sets to undefined when attempting to build default for non array/object types', function(assert) {
  property = new Property({
    'id': 'http://jsonschema.net/address/streetAddress',
    'type': 'string'
  });

  assert.equal(property.buildDefaultValue(), undefined, 'uses undefined for non array/object properties');
});

test('inputType returns the correct type of element', function(assert) {
  assert.equal(property.properties.streetAddress.inputType, 'text');
  assert.equal(property.properties.city.inputType, 'text');
  assert.equal(property.properties.state.inputType, 'select');
});
