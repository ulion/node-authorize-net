const assert = require('assert');

module.exports = {
	randomAmount: randomAmount,
	assertNumber: assertNumber,
	assertString: assertString,
	assertDate: assertDate,
	assertProperty: assertProperty,
};

function randomAmount(max, min) {
  min = min || 0.01;
  return (Math.random() * ((max || 300) - min) + min).toFixed(2);
}

function assertNumber(value) {
  return assert.equal(typeof value, 'number', 'expected ' + JSON.stringify(value) + ' to be a number.');
};

function assertString(value) {
  return assert.equal(typeof value, 'string', 'expected ' + JSON.stringify(value) + ' to be a string.');
};

function assertDate(value) {
  return assert.ok(value instanceof Date, 'expected ' + JSON.stringify(value) + ' to be a Date.');
};

function assertProperty(object, propertyName) {
  return assert.ok(propertyName in object, 'expected ' + propertyName + ' of ' + JSON.stringify(object) + ' to be defined.');
};
