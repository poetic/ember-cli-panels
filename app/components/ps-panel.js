import Ember from 'ember';
import DraggablePanelMixin from 'ember-cli-panels/mixins/draggable-panel';
import animate from 'ember-cli-panels/utils/animate';

export default Ember.Component.extend(DraggablePanelMixin, {
  animating: false,

  classNames: 'ps-panel',

  paneControllers:  Ember.A([]), // public [1,2,3]
  paneComponents:   Ember.A([]), // [3,2,1]
  currentPaneName:  null, // public
  currentPane: null,

  $container:        null,
  $panel:            null,
  elWidth:           0,
  containerWidth:    0,
  containerXOffset:  0,

  registerPane: function(paneComponent) {
    this.get('paneComponents').unshiftObject(paneComponent);
  },

  unregisterPane: function(paneComponent) {
    this.get('paneComponents').removeObject(paneComponent);
  },

  updateVisiblePane: Ember.observer('currentPaneName', 'paneComponents.[]', 'paneControllers.[]', function() {
    // Guard to make sure all paneControllers are rendered before running any animations.
    if (this.get('paneComponents.length') !== this.get('paneControllers.length')) {
      return;
    }

    if (this.get('animating')) {
      return;
    }

    var hasShownPane    = false;
    var currentPaneName = this.get('currentPaneName');
    var component       = this;

    var animations = this.get('paneComponents').map(function(pane, index) {
      if (pane.get('name') === currentPaneName) {
        hasShownPane = true;
        this.set('currentPane', pane);

        return Ember.RSVP.resolve(pane._showAnimation()).then(function() {
          return component.animateToPaneAtIndex(index);
        });

      } else {
        return Ember.RSVP.resolve(pane._hideAnimation());
      }
    }, this);

    if (!hasShownPane) {
      throw new Ember.Error('Could not find pane with name "' + currentPaneName + '" to show.');
    }

    return Ember.RSVP.all(animations).finally(function() {
      component.send('stopAnimating');
    });
  }),

  paneIndex: Ember.computed('paneComponents.[]', 'currentPane', function() {
    return this.get('paneComponents').indexOf(this.get('currentPane'));
  }),

  prevPane: Ember.computed('paneComponents.[]', 'paneIndex', function() {
    return this.get('paneComponents')[this.get('paneIndex') - 1]
  }),

  nextPane: Ember.computed('paneComponents.[]', 'paneIndex', function() {
    return this.get('paneComponents')[this.get('paneIndex') + 1]
  }),

  scrollingPanes: Ember.computed.filterBy('paneComponents', 'scrolling', true),
  isPaneScrolling: Ember.computed('scrollingPanes.[]', function() {
    return this.get('scrollingPanes.length') > 0;
  }),

  setupJqCache: Ember.on('didInsertElement', function() {
    var $panel = this.$();
    this.set('$panel', $panel);
    this.set('$container', $panel.find('.ps-panel-container'));
  }),

  containerWidthChanged: Ember.observer('containerWidth', '$container',
                                        'elWidth', 'paneComponents.[]', function() {
    var $container = this.get('$container');
    if ($container) {
      $container.width(this.get('containerWidth'));
    }

    this.get('paneComponents').forEach(function(component) {
      if (this.get('elWidth')) {
        component.updateWidth(this.get('elWidth'))
      }
    }, this);
  }),

  animateToPaneAtIndex: function(index, ms) {
    if (this.get('animating')) {
      return;
    }

    if (!ms) {
      ms = 325;
    }

    var component = this;

    component.send('startAnimating');

    var containerXOffset = component.xOffsetForIndex(index);
    this.set('containerXOffset', containerXOffset);

    var pane = this.get('paneComponents')[index];

    return animate(component.get('$container'), {
      translateX: containerXOffset
    }, ms).then(function() {
      component.setProperties({
        currentPane: pane,
        currentPaneName: pane.get('name')
      });
      component.send('stopAnimating');
    });
  },

  animateToPane: function(pane) {
    var index = this.get('paneComponents').indexOf(pane);

    return this.animateToPaneAtIndex(index, 200);
  },

  updateContainerWidth: function(singlePaneWidth) {
    var newWidth = singlePaneWidth * this.get('paneControllers.length');
    this.set('elWidth', singlePaneWidth);
    this.set('containerWidth', newWidth);
  },

  animateToCurrentPane: function() {
    return this.animateToPaneAtIndex(this.get('paneIndex'));
  },

  xOffsetForIndex: function(index) {
    var elWidth = this.get('elWidth');
    var offset = -(index * elWidth);

    return offset;
  },

  actions: {
    startAnimating: function() {
      this.set('animating', true);
    },

    stopAnimating: function() {
      this.set('animating', false);
    }
  }
});
