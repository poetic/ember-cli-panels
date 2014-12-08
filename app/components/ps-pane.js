import Ember from 'ember';

export default Ember.Component.extend({
  name: Ember.computed.alias('pane.name'),

  classNames: 'ps-pane',

  panel: Ember.computed.alias('parentView'),

  registerPane: Ember.on('didInsertElement', function() {
    return this.get('panel').registerPane(this);
  }),

  unregisterPane: Ember.on('willDestroyElement', function() {
    return this.get('panel').unregisterPane(this);
  }),

  _hideAnimation: function() {
    if (this.get('hideAnimation')) {
      return this.get('hideAnimation')();
    }

    return this.$().hide();
  },

  _showAnimation: function() {
    if (this.get('showAnimation')) {
      return this.get('showAnimation')();
    }

    return this.$().show();
  }
});
