import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['pane'],

  showAnimation: function() {
    return animate(this, {translateX: 0, opacity: 1}, {}, 'show ps-pane');
  },

  hideAnimation: function() {
    return animate(this, {translateX: -100, opacity: 0}, {}, 'hide ps-pane');
  },
});
