var conf = require('../config.js');
var assert = require('assert');
var AuthorizeGateway = require('../index.js');

var assertNumber = function (value) {
  return assert.equal(typeof value, 'number', 'expected ' + JSON.stringify(value) + ' to be a number.');
};

var assertString = function (value) {
  return assert.equal(typeof value, 'string', 'expected ' + JSON.stringify(value) + ' to be a string.');
};

var assertDate = function (value) {
  return assert.ok(value instanceof Date, 'expected ' + JSON.stringify(value) + ' to be a Date.');
};

var assertProperty = function (object, propertyName) {
  return assert.ok(propertyName in object, 'expected ' + propertyName + ' of ' + JSON.stringify(object) + ' to be defined.');
};

describe('getSettledBatchList', function () {
  var service;

  beforeEach(function () {
    conf.testMode = true;
    service = AuthorizeGateway(conf);
  });

  it('should return array of batches', function () {
    var NUMBER_FIELDS = [
      'chargeAmount',
      'refundAmount',
      'refundCount',
      'voidCount',
      'declineCount',
      'errorCount',
    ];

    return service.getSettledBatchList(new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date())
      .then(function (response) {
        assert.equal(Array.isArray(response), true);

        response.forEach(function (batch) {
          assertString(batch.batchId);
          assertDate(batch.settlementDate);

          NUMBER_FIELDS.forEach(function (fieldName) {
            assertProperty(batch, fieldName);
            assertNumber(batch[fieldName]);
          });
        });
      });
  });

  it('should reject if no "from" date provided', function () {
    return service.getSettledBatchList()
      .then(function () {
        throw new Error('Was not rejected.');
      })
      .catch(function (err) {
        assert.ok((/required/).test(err.message) && (/from/i).test(err.message), 'expected error message to mention "from" being required.');
      });
  });

});
