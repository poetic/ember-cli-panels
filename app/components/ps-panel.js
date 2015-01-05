import Ember from 'ember';
import DraggablePanelMixin from 'ember-cli-panels/mixins/draggable-panel';
import SwipeablePanelMixin from 'ember-cli-panels/mixins/swipeable-panel';
import ReverseCssMixin from 'ember-cli-panels/mixins/reverse-css';
import animate from 'ember-cli-panels/utils/animate';

export default Ember.Component.extend(DraggablePanelMixin, SwipeablePanelMixin,
                                      ReverseCssMixin, {
  animating: false,

  classNames: 'ps-panel',

  paneControllers:  Ember.A([]), // public
  paneComponents:   Ember.A([]),
  currentPaneName:  null, // public
  currentPane: null,

  $container:  null,
  $panel:      null,
  elWidth:     0,

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

  absolutePositionPanes: function() {
    this.setProperties({ reverseCss: [] });

    var component    = this;
    var $currentPane = this.get('currentPane').$();
    var $panel       = this.get('$panel');
    var elWidth      = $currentPane.outerWidth();
    var elHeight     = $currentPane.outerHeight();
    var elPosition   = $currentPane.position();

    var cssOpts = {
      position:  'absolute',
      top:       elPosition.top,
      left:      elPosition.left,
      width:     elWidth,
      height:    elHeight
    };

    this.get('$container').css('-webkit-transition', 'none');

    this.set('elWidth', elWidth);

    cssOpts.left = (elPosition.left - elWidth) + 'px';
    this.showAndSetCss(this.get('prevPane'), cssOpts);

    cssOpts.left = (elPosition.left + elWidth) + 'px';
    this.showAndSetCss(this.get('nextPane'), cssOpts);
  },

  paneIndex: Ember.computed('paneComponents.[]', 'currentPane', function() {
    return this.get('paneComponents').indexOf(this.get('currentPane'));
  }),

  prevPane: Ember.computed('paneComponents.[]', 'paneIndex', function() {
    return this.get('paneComponents')[this.get('paneIndex') - 1]
  }),

  nextPane: Ember.computed('paneComponents.[]', 'paneIndex', function() {
    return this.get('paneComponents')[this.get('paneIndex') + 1]
  }),

  setupJqCache: Ember.on('didInsertElement', function() {
    var $panel = this.$();
    this.set('$panel', $panel);
    this.set('$container', $panel.find('.ps-panel-container'));
  }),

  animateToNewPane: function(translateX, pane, ms) {
    this.send('startAnimating');

    var component = this;

    return animate(this.get('$container'), {
      translateX: translateX
    }, ms).then(function() {
      component.set('currentPaneName', pane.get('name'));
    });
  },

  animateToCurrentPane: function() {
    this.send('startAnimating');

    var component = this;

    var $currentPane = this.get('currentPane').$();

    return animate(this.get('$container'), {
      translateX: 0
    }).then(function() {
      return component.updateVisiblePane();
    });
  },

  finishAnimation: function(animation) {
    var component = this;

    return Ember.RSVP.resolve(animation).then(function() {
      component.reverseCssChanges()

      component.get('$container').css({
        transform: 'translateX(0px)'
      });
    }).then(function() {
      component.set('animating', false);
      component.send('stopAnimating');
    });
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
