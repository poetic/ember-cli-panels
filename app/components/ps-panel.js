import Ember from 'ember';

export default Ember.Component.extend({
  animating: false,

  classNames: 'ps-panel',

  panes:          [],
  renderedPanes:  [],

  registerPane: function(paneComponent) {
    this.get('renderedPanes').pushObject(paneComponent);
  },

  unregisterPane: function(paneComponent) {
    this.get('renderedPanes').removeObject(paneComponent);
  },

  updateVisiblePane: Ember.observer('currentPane', 'renderedPanes.[]', 'panes.[]', function() {
    // Guard to make sure all panes are rendered before running any animations.
    if (this.get('renderedPanes.length') !== this.get('panes.length')) {
      return;
    }

    this.send('startAnimating');
    var hasShownPane = false;

    var currentPane = this.get('currentPane');

    var animations = this.get('renderedPanes').map(function(pane) {
      if (pane.get('name') === currentPane) {
        hasShownPane = true;
        return Ember.RSVP.resolve(pane._showAnimation());
      } else {
        return Ember.RSVP.resolve(pane._hideAnimation());
      }
    });

    if (!hasShownPane) {
      throw new Ember.Error('Could not find pane with name "' + currentPane + '" to show.');
    }

    return Ember.RSVP.all(animations).finally(Ember.run.bind(this, function() {
      this.send('stopAnimating');
    }));
  }),

  actions: {
    startAnimating: function() {
      this.set('animating', true);
    },

    stopAnimating: function() {
      this.set('animating', false);
    }
  }
});
