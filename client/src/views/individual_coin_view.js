const PubSub = require('../helpers/pub_sub.js')

const IndividualCoinView = function(container){

  this.container = container;

};

IndividualCoinView.prototype.bindEvents = function () {
  PubSub.subscribe('coin:chosen-coin-price-History', (event) => {
    const priceHistory = event.detail;
    this.render(priceHistory);
  })
};

IndividualCoinView.prototype.render = function (priceHistory) {

};


module.exports = IndividualCoinView;
