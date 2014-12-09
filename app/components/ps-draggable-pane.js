import Ember from 'ember';
import PsPane from './ps-pane';

function animate($el, opts) {
  return Ember.$.Velocity($el, opts, 200, [300, 30]);
}

function setCss($el, cssOpts) {
  var reverseOpts = {};

  Ember.keys(cssOpts).forEach(function(key) {
    reverseOpts[key] = '';
  });

  $el.css(cssOpts)

  return function() {
    $el.css(reverseOpts)
  };
}

export default PsPane.extend({
  setupTouch: Ember.on('didInsertElement', function() {
    var component = this;
    var $el        = this.$();
    var $panel     = this.$().parents('.ps-panel');
    var $container = this.$().parents('.ps-panel-container');

    var hammer = new Hammer($el[0]);
    hammer.get('pan').set({ threshold: 10, direction: Hammer.DIRECTION_HORIZONTAL });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    var panning = false;

    var elWidth, elHeight, elPosition, visiblePaneOpts, panes, currentPaneIndex,
        prevPane, currentPane, nextPane, offset, reverseCss = [];

    hammer.on('panstart', function() {
      panning = true;
      reverseCss = [];

      panes            = component.get('panel.renderedPanes');
      currentPaneIndex = panes.indexOf(component);

      // We need to set the height to the max height out of ALL the panes. If
      // it's shorter than one, it will look cut off during the drag
      var maxHeight = panes.reduce(function(height, pane) {
        var paneHeight = pane.$().outerHeight();

        if (paneHeight > height) {
          return paneHeight;
        }

        return height;
      }, 0);

      reverseCss.push(
        setCss($panel, { height: maxHeight })
      );

      elWidth    = $el.outerWidth();
      elHeight   = $el.outerHeight();
      elPosition = $el.position();

      offset = elWidth * 0.5;

      visiblePaneOpts = {
        position:  'absolute',
        top:       elPosition.top,
        left:      elPosition.left,
        width:     elWidth,
        height:    elHeight
      };

      prevPane    = panes[currentPaneIndex - 1];
      currentPane = component;
      nextPane    = panes[currentPaneIndex + 1];

      reverseCss.push(
        setCss(currentPane.$(), visiblePaneOpts)
      );

      if (prevPane) {
        visiblePaneOpts.left = (elPosition.left - elWidth) + 'px';
        reverseCss.push(
          setCss(prevPane.$(), visiblePaneOpts)
        );
        prevPane.$().removeClass('hide');
      }

      if (nextPane) {
        visiblePaneOpts.left = (elPosition.left + elWidth) + 'px';
        reverseCss.push(
          setCss(nextPane.$(), visiblePaneOpts)
        );
        nextPane.$().removeClass('hide');
      }
    });

    hammer.on('panmove', function(event){
      $container.velocity({
        translateX: event.deltaX
      }, { duration: 0 });
    });

    var animateToNextPane = function() {
      return animate($container, {
        translateX: -elWidth
      }).then(function() {
        component.set('panel.currentPane', nextPane.get('name'));
      });
    };

    var animateToPrevPane = function() {
      return animate($container, {
        translateX: elWidth
      }).then(function() {
        component.set('panel.currentPane', prevPane.get('name'));
      });
    };

    var animateToCurrentPane = function() {
      return animate($container, { translateX: 0 }).then(function() {
        return component.get('panel').updateVisiblePane();
      });
    };

    var finishAnimation = function(animation) {
      panning = false;

      return Ember.RSVP.resolve(animation).then(function() {
        reverseCss.forEach(function(fn) { fn() });
        $container.css({transform: 'translateX(0px)'});
      });
    }

    hammer.on('panend', function(event) {
      if (!panning) {
        return;
      }

      var delta = event.deltaX;

      var animation;

      if (prevPane && delta > offset) {
        animation = animateToPrevPane();
      } else if (delta > 0) {
        animation = animateToCurrentPane();
      } else if (nextPane && Math.abs(delta) > offset) {
        animation = animateToNextPane();
      } else {
        animation = animateToCurrentPane();
      }

      finishAnimation(animation);
    });

    hammer.on('swipeleft', function() {
      var animation;

      if (nextPane) {
        animation = animateToNextPane();
      } else {
        animation = animateToCurrentPane();
      }

      finishAnimation(animation);
    });

    hammer.on('swiperight', function() {
      var animation;
      if (prevPane) {
        animation = animateToPrevPane();
      } else {
        animation = animateToCurrentPane();
      }

      finishAnimation(animation);
    });
  }),

  _hideAnimation: function() {
    return this.$().addClass('hide');
  },

  _showAnimation: function() {
    return this.$().removeClass('hide');
  }
});
