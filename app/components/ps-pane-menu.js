import Ember from 'ember';
import ComponentRegistry from 'ember-cli-panels/mixins/component-registry';

export default Ember.Component.extend(ComponentRegistry, {
  classNames: 'ps-pane-menu',

  currentPane:          null,
  panePrefix:           null,
  childComponentsName:  'linkComponents', // for ComponentRegistry
  linkComponents:       Ember.A([]),

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
