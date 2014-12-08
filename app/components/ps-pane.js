import Ember from 'ember';

export default Ember.Component.extend({
  name: Ember.computed.alias('pane.name'),

  classNames: 'ps-pane',

  panel: Ember.computed.alias('parentView'),

  registerPane: Ember.on('didInsertElement', function() {
    return this.get('panel').registerPane(this);
  }),

  hideAnimation: function() {
    return this.$().hide();
  },

  showAnimation: function() {
    return this.$().show();
  }
});
