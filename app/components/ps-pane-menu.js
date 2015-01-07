import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'ps-pane-menu',

  currentPane:     null,
  panePrefix:      null,
  linkComponents:  Ember.A([]),

  registerLink: function(component) {
    this.get('linkComponents').pushObject(component);
  },

  unregisterLink: function(component) {
    this.get('linkComponents').removeObject(component);
  },

  actions: {
    switchPane: function(newPane) {
      if (this.get('panePrefix')) {
        newPane = this.get('panePrefix') + '/' + newPane;
      }

      this.set('currentPane', newPane);
    }
  },

  activePane: Ember.computed('linkComponents.@each.active', function() {
    return this.get('linkComponents').findBy('active', true);
  }),

  linkComponentsDidChange: Ember.observer('linkComponents.[]', 'activePane', function() {
    var activePane = this.get('activePane');

    if (activePane) {
      var animation = activePane.scrollIntoCenter(this);
      animation.then(function() {
        // console.log('done');
      });
    }
  })
});
