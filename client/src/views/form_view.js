const PubSub = require('../helpers/pub_sub')

// Nest this form view somewhere appropriate in the app

const FormView = function(form){
  this.form = form;
}

FormView.prototype.bindEvents = function(){
  this.form.addEventListener('submit', (event) => {
    this.handleSubmit(event);
  })
}

FormView.prototype.handleSubmit = function(event){
  event.preventDefault();
  PubSub.publish('FormView:coin-submitted', event.target);
  this.form.reset(); // Reset form last otherwise you lose the values
}

module.exports = FormView;
