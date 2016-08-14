var conf = require('../config.js');
var assert = require('assert');
var AuthorizeGateway = require('../index.js');
var utils = require('./fixtures/utils.js');

describe('getTransactionList', function () {
  conf.testMode = true;

  var service;
  var batchList;

  before(function () {
    batchList = AuthorizeGateway(conf).getSettledBatchList(new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date());
  });

  beforeEach(function () {
    service = AuthorizeGateway(conf);
  });

  it('should return array of batches', function () {
    var STRING_FIELDS = [
      'transactionId',
      'transactionStatus',
      'accountType',
      'accountNumber',
      'marketType',
      'product',
    ];

    return batchList.then(function (batchList) {
      var firstBatch = batchList[0];
      return service.getTransactionList(firstBatch.batchId);
    })
      .then(function (response) {
        assert.equal(Array.isArray(response), true);

        response.forEach(function (transaction) {
          STRING_FIELDS.forEach(function (fieldName) {
            utils.assertProperty(transaction, fieldName);
            utils.assertString(transaction[fieldName]);
          });

          if (transaction.firstName) utils.assertString(transaction.firstName);
          if (transaction.lastName) utils.assertString(transaction.lastName);

          utils.assertProperty(transaction, 'submitTime');
          utils.assertDate(transaction.submitTime);
          utils.assertProperty(transaction, 'settleAmount');
          utils.assertNumber(transaction.settleAmount);
        });
      });
  });

  it('should reject if no batch ID provided', function () {
    return service.getTransactionList()
      .then(function () {
        throw new Error('Was not rejected.');
      })
      .catch(function (err) {
        assert.ok((/batch id/i).test(err.message) && (/required/i).test(err.message), 'expected error message to mention batch id being required: ' + err.message);
      });
  });

});
