import Ember from 'ember';
import DraggablePanelMixin from 'ember-cli-panels/mixins/draggable-panel';

export default Ember.Component.extend(DraggablePanelMixin, {
  animating: false,

  classNames: 'ps-panel',

  paneControllers:  Ember.A([]), // public
  paneComponents:   Ember.A([]),
  currentPaneName:  null, // public
  currentPane: null,

  registerPane: function(paneComponent) {
    this.get('paneComponents').pushObject(paneComponent);
  },

  unregisterPane: function(paneComponent) {
    this.get('paneComponents').removeObject(paneComponent);
  },

  updateVisiblePane: Ember.observer('currentPaneName', 'paneComponents.[]', 'paneControllers.[]', function() {
    // Guard to make sure all paneControllers are rendered before running any animations.
    if (this.get('paneComponents.length') !== this.get('paneControllers.length')) {
      return;
    }

    this.send('startAnimating');
    var hasShownPane = false;

    var currentPaneName = this.get('currentPaneName');

    var animations = this.get('paneComponents').map(function(pane) {
      if (pane.get('name') === currentPaneName) {
        hasShownPane = true;
        this.set('currentPane', pane);
        return Ember.RSVP.resolve(pane._showAnimation());
      } else {
        return Ember.RSVP.resolve(pane._hideAnimation());
      }
    }, this);

    if (!hasShownPane) {
      throw new Ember.Error('Could not find pane with name "' + currentPaneName + '" to show.');
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
