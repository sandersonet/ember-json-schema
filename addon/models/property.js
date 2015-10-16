import getProperties from '../utils/get-properties';
import buildDefaultValueForType from '../utils/build-default-value-for-type';

export default class Property {
  constructor(property) {
    if (!property) {
      throw new Error('You must provide a property definition to the Property constructor.');
    }

    this._property = property;
  }

  get type() {
    return this._property.type;
  }

  get title() {
    return this._property.title;
  }

  get inputType() {
    if (Array.isArray(this._property.enum)) {
      return 'select';
    }

    switch (this.type) {
      case 'boolean':
        return 'radio';
      case 'string':
        return 'text';
      case 'number':
        return 'number';
      case 'integer':
        return 'number';

    }
  }

  get properties() {
    return getProperties(this, this._property.properties);
  }

  buildDefaultValue() {
    return buildDefaultValueForType(this._property.type);
  }
}

