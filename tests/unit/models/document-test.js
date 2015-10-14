import Schema from 'ember-json-schema/models/schema';
import Document from 'ember-json-schema/models/document';
import { module, test, skip } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arrayBaseObjectFixture from '../../fixtures/location-schema';

module('models/document', {
  beforeEach() {
    this.schema = new Schema(schemaFixture);
    this.document = this.schema.buildDocument();
  }
});

test('requires a schema', function(assert) {
  assert.throws(function() {
    new Document();
  }, /You must provide a Schema instance to the Document constructor/);
});

test('can set a value for a root property', function(assert) {
  this.document.set('description', 'awesome sauce');

  assert.equal(this.document.get('description'), 'awesome sauce');
});

test('can set a value for a nested property', function(assert) {
  this.document.set('address.streetAddress', '123 Blah St.');

  assert.equal(this.document.get('address.streetAddress'), '123 Blah St.');
});

test('using an invalid property throws an error', function(assert) {
  assert.throws(function() {
    this.document.set('address.nonExistant', 'foo');
  }, /You may not set a nonexistant field/);
});

test('set without a value throws an error', function(assert) {
  assert.throws(function() {
    this.document.set('address');
  }, /You must provide a value as the second argument to `.set`/);
});

test('toJSON returns a object with values that were set', function(assert) {
  this.document.set('address.streetAddress', '123 Blah St.');
  this.document.set('address.city', 'Hope');

  // TODO: deal with phoneNumber array somehow

  let result = this.document.toJSON();

  assert.deepEqual(result, {
    address: {
      streetAddress: '123 Blah St.',
      city: 'Hope'
    }
  });
});

test('calling addItem on a non-array throws', function(assert) {
  let numberInstance = {
    location: 'home',
    code: '8675309'
  };

  assert.throws(() => {
    this.document.addItem('address', numberInstance);
  }, /You can only call `addItem` on documents with a base object of `array`/);
});

test('add array as base object type using per-property syntax', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let item = this.document.addItem();
  for (let key in expected) {
    item.set(key, expected[key]);
  }

  let result = this.document.toJSON();

  assert.deepEqual(result, [expected]);
});

test('can add multiple items to an array based document using per-property syntax', function(assert) {
  let item;

  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let expected2 = {
    'description': 'other stuff here',
    'streetAddress': 'totally known st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  item = this.document.addItem();
  for (let key in expected1) {
    item.set(key, expected1[key]);
  }

  item = this.document.addItem();
  for (let key in expected2) {
    item.set(key, expected2[key]);
  }

  let result = this.document.toJSON();

  assert.deepEqual(result, [expected1, expected2]);
});

skip('throw an error if calling `toJSON` when required fields are not specified');
skip('handle array properties (where you have many of a given item)');
skip('add validations when setting property types');
