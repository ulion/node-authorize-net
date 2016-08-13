var conf = require('../config.js');
var assert = require('assert');
var AuthorizeGateway = require('../index.js');
var SubscriptionPlan = require('42-cent-model').SubscriptionPlan;
var CreditCard = require('42-cent-model').CreditCard;
var Prospect = require('42-cent-model').Prospect;
var casual = require('casual');

//to avoid duplicate transaction we change the amount
function randomAmount(max) {
  return Math.ceil(Math.random() * (max || 300));
}

describe('create subscription', function () {
  var service;

  beforeEach(function () {
    conf.testMode = true;
    service = AuthorizeGateway(conf);
  });

  it('should create a subscription', function (done) {
    var subscription = new SubscriptionPlan({
      amount: randomAmount(100),
      trialCount: 1,
      trialAmount: '10'
    })
      .withIterationCount('12')
      .withPeriodLength(1)
      .withPeriodUnit('months')
      .withStartingDate(new Date(Date.now() + 7 * 3600 * 24 * 1000));

    var creditCard = new CreditCard()
      .withCreditCardNumber('4111111111111111')
      .withCvv2('123')
      .withExpirationMonth('01')
      .withExpirationYear('2018');

    var prospect = new Prospect()
      .withBillingFirstName('bob')
      .withBillingLastName('leponge');

    service.createSubscription(creditCard, prospect, subscription)
      .then(function (res) {
        assert(res.subscriptionId, 'subscriptionId should be defined');
        assert(res._original, 'original should be defined');
        done();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  it('should create a subscription without trial period', function (done) {
    var subscription = new SubscriptionPlan({
      amount: randomAmount(100)
    })
      .withIterationCount('12')
      .withPeriodLength(1)
      .withPeriodUnit('months')
      .withStartingDate(new Date(Date.now() + 7 * 3600 * 24 * 1000));

    var creditCard = new CreditCard()
      .withCreditCardNumber('4111111111111111')
      .withCvv2('123')
      .withExpirationMonth('01')
      .withExpirationYear('2018');

    var prospect = new Prospect()
      .withBillingLastName(casual.last_name)
      .withBillingFirstName(casual.first_name)
      .withBillingAddress1(casual.address)
      .withBillingCity(casual.city)
      .withBillingPostalCode(casual.zip)
      .withBillingState(casual.state)
      .withBillingCountry(casual.country_code)
      .withShippingLastName(casual.last_name)
      .withShippingFirstName(casual.first_name)
      .withShippingAddress1(casual.address)
      .withShippingCity(casual.city)
      .withShippingPostalCode(casual.zip)
      .withShippingState(casual.state)
      .withShippingCountry(casual.country_code);

    service.createSubscription(creditCard, prospect, subscription)
      .then(function (res) {
        assert(res.subscriptionId, 'subscriptionId should be defined');
        assert(res._original, 'original should be defined');
        done();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  it('should reject the promise', function (done) {
    var subscription = new SubscriptionPlan({amount: randomAmount(100) })
      .withIterationCount('12')
      .withPeriodLength(1)
      .withPeriodUnit('months')
      .withStartingDate(new Date(Date.now() + 7 * 3600 * 24 * 1000));

    var creditCard = new CreditCard()
      .withCreditCardNumber('4111111111111111')
      .withCvv2('123')
      .withExpirationMonth('01')
      .withExpirationYear('2009');

    var prospect = new Prospect()
      .withBillingLastName(casual.last_name)
      .withBillingFirstName(casual.first_name)
      .withBillingAddress1(casual.address)
      .withBillingCity(casual.city)
      .withBillingPostalCode(casual.zip)
      .withBillingState(casual.state)
      .withBillingCountry(casual.country_code)
      .withShippingLastName(casual.last_name)
      .withShippingFirstName(casual.first_name)
      .withShippingAddress1(casual.address)
      .withShippingCity(casual.city)
      .withShippingPostalCode(casual.zip)
      .withShippingState(casual.state)
      .withShippingCountry(casual.country_code);

    service.createSubscription(creditCard, prospect, subscription)
      .then(function (res) {
        throw new Error('it should not get here');
      }, function (err) {

        assert(err.message, '- The credit card has expired.- Credit Card expires before the start of the subscription.');
        assert(err._original, '_original should be defined');
        done();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

});