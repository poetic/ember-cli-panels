import Ember from 'ember';
import ChildComponent from 'ember-cli-panels/mixins/child-component';
import findComponentByName from 'ember-cli-panels/utils/find-component-by-name';

export default Ember.Component.extend(ChildComponent, {
  name: Ember.computed.alias('pane.name'),
  scrolling: false,

  classNames: 'ps-pane',

  parentName:  'panel', // for ChildComponent
  panel:       findComponentByName('ps-panel'),
  animating:   Ember.computed.alias('panel.animating'),

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
