import Ember from 'ember';
import ComponentRegistry from 'ember-cli-panels/mixins/component-registry';

export default Ember.Component.extend(ComponentRegistry, {
  classNames: 'ps-pane-menu',

  currentPane:          null,
  panePrefix:           null,
  childComponentsName:  'linkComponents', // for ComponentRegistry
  linkComponents:       Ember.A([]),
  animating:            false,
  isFirstRender:        true,

  switchPane: function(newPane) {
    if (this.get('animating')) {
      return;
    }

    // hackyhack fixes flashing bug from clicking to next pane too quick in menu
    // I think the run loop / ember ends up merging all the changes into one
    // when I use the timeout? I figured it would do this anyways but it doesn't
    // seem to.
    Ember.run.later(this, function() {
      this.set('currentPane', newPane);
    }, 100);
  },

  activeLink: Ember.computed('linkComponents.@each.active', function() {
    return this.get('linkComponents').findBy('active', true);
  }),

  initialScrollToCenter: Ember.on('didInsertElement', function() {
    return this.scrollToCenter();
  }),

  scrollToCenter: Ember.observer('currentPane', function() {
    var menu       = this;
    var activeLink = this.get('activeLink');

    if (!activeLink) {
      return;
    }

    var ms = 200;
    if (menu.get('isFirstRender')) {
      menu.set('isFirstRender', false);
      ms = 0;
    }

    menu.set('animating', true);
    activeLink.scrollIntoCenter(menu, ms).then(function() {
      menu.set('animating', false);
    });
  })
});
