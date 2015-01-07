import Ember from 'ember';
import { animate } from 'liquid-fire';

export default Ember.Component.extend({
  menu:         Ember.computed.alias('parentView'),
  currentPane:  Ember.computed.alias('menu.currentPane'),
  panePrefix:   Ember.computed.alias('menu.panePrefix'),

  tagName: 'a',
  classNames: 'ps-pane-link',

  attributeBindings: ['href'],
  href: '#',

  classNameBindings: ['active'],
  active: Ember.computed('currentPane', 'prefixedTo', function() {
    return Ember.isEqual(this.get('currentPane'), this.get('prefixedTo'));
  }),

  prefixedTo: Ember.computed('panePrefix', 'to', function() {
    if (this.get('panePrefix')) {
      return this.get('panePrefix') + '/' + this.get('to');
    }

    return this.get('to');
  }),

  registerWithMenu: Ember.on('didInsertElement', function() {
    this.get('menu').registerLink(this);
  }),

  unregisterWithMenu: Ember.on('willDestroyElement', function() {
    this.get('menu').unregisterLink(this);
  }),

  click: function(e) {
    e.preventDefault();

    this.get('menu').send('switchPane', this.get('to'));
  },

  scrollIntoCenter: function(menu) {
    return animate(this, 'scroll', {
      container: menu.$(),
      axis: 'x',
      offset: this.calculateOffset(menu.$(), this.$())
    });
  },

  calculateOffset: function($menu, $el) {
    var menuWidth = $menu.outerWidth();
    var elWidth   = $el.outerWidth();

    return elWidth / 2 - menuWidth / 2;
  }
});
