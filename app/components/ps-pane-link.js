import Ember from 'ember';
import { animate } from 'liquid-fire';
import ChildComponent from 'ember-cli-panels/mixins/child-component';
import findComponentByName from 'ember-cli-panels/utils/find-component-by-name';

export default Ember.Component.extend(ChildComponent, {
  parentName:   'menu', // for ChildComponent
  menu:         findComponentByName('ps-pane-menu'),
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

  click: function(e) {
    e.preventDefault();

    this.get('menu').sendAction('action', this.get('prefixedTo'));
    this.get('menu').switchPane(this.get('prefixedTo'));
  },

  scrollIntoCenter: function(menu, duration) {
    return animate(this, 'scroll', {
      container: menu.$(),
      axis: 'x',
      offset: this.calculateOffset(menu.$(), this.$()),
      duration: duration
    });
  },

  calculateOffset: function($menu, $el) {
    var menuWidth = $menu.outerWidth();
    var elWidth   = $el.outerWidth();

    return elWidth / 2 - menuWidth / 2;
  }
});
