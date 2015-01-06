import Ember from 'ember';

export default Ember.Component.extend({
  name: Ember.computed.alias('pane.name'),
  scrolling: false,

  classNames: 'ps-pane',

  panel: Ember.computed.alias('parentView'),
  animating: Ember.computed.alias('panel.animating'),

  registerPane: Ember.on('didInsertElement', function() {
    return this.get('panel').registerPane(this);
  }),

  unregisterPane: Ember.on('willDestroyElement', function() {
    return this.get('panel').unregisterPane(this);
  }),

  addScrollHandler: Ember.on('didInsertElement', function() {
    this.$().on('scrollstart', this.scrollstart.bind(this));
    this.$().on('scrollstop', this.scrollstop.bind(this));
  }),

  removeScrollHandler: Ember.on('willDestroyElement', function() {
    this.$().off('scrollstart', this.scrollstart.bind(this));
    this.$().off('scrollstop', this.scrollstop.bind(this));
  }),

  scrollstart: function() {
    this.set('scrolling', true);
  },

  scrollstop: function() {
    this.set('scrolling', false);
  },

  _hideAnimation: function() {
    if (this.get('hideAnimation')) {
      return this.get('hideAnimation')(this);
    }

    return this.$().hide();
  },

  _showAnimation: function() {
    if (this.get('showAnimation')) {
      return this.get('showAnimation')(this);
    }

    return this.$().show();
  }
});
