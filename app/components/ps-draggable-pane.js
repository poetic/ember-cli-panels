import Ember from 'ember';
import PsPane from './ps-pane';

export default PsPane.extend({
  reverseCss:        Ember.A([]),
  $container:        null,
  $panel:            null,

  panes: Ember.computed.alias('panel.renderedPanes'),

  paneIndex: Ember.computed('panes.[]', function() {
    return this.get('panes').indexOf(this);
  }),

  prevPane: Ember.computed('panes.[]', 'paneIndex', function() {
    return this.get('panes')[this.get('paneIndex') - 1]
  }),

  nextPane: Ember.computed('panes.[]', 'paneIndex', function() {
    return this.get('panes')[this.get('paneIndex') + 1]
  }),

  threshold: Ember.computed('elWidth', function() {
    return this.get('elWidth') * 0.30
  }),

  setupHammer: Ember.on('didInsertElement', function() {
    var component  = this;

    var hammer = new Hammer(this.$()[0]);

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_HORIZONTAL
    });

    hammer.on('panstart', Ember.run.bind(this, this.panstart));
    hammer.on('panmove', Ember.run.bind(this, this.panmove));
    hammer.on('panend', Ember.run.bind(this, this.panend));
  }),

  setupJqCache: Ember.on('didInsertElement', function() {
    var $panel = this.get('panel').$();
    this.set('$panel', $panel);
    this.set('$container', $panel.find('.ps-panel-container'));
  }),

  panstart: function(/* event */) {
    if (this.get('animating')) {
      return;
    }

    this.setProperties({
      reverseCss: []
    });

    var component    = this;
    var $el          = this.$();
    var $panel       = this.get('$panel');
    var maxHeight    = this.calculateMaxPaneHeight();
    var elWidth      = $el.outerWidth();
    var elHeight     = $el.outerHeight();
    var elPosition   = $el.position();
    var $currentPane = this.$();

    var cssOpts = {
      position:  'absolute',
      top:       elPosition.top,
      left:      elPosition.left,
      width:     elWidth,
      height:    elHeight
    };

    this.set('elWidth', elWidth);

    this.setCss($panel, { height: maxHeight })

    cssOpts.left = (elPosition.left - elWidth) + 'px';
    this.showAndSetCss(this.get('prevPane'), cssOpts);

    cssOpts.left = (elPosition.left + elWidth) + 'px';
    this.showAndSetCss(this.get('nextPane'), cssOpts);
  },

  panmove: function(event) {
    if (this.get('animating')) {
      return;
    }

    Ember.$.Velocity(this.get('$container'), {
      translateX: event.deltaX
    }, { duration: 0 });
  },

  panend: function(event) {
    if (this.get('animating')) {
      return;
    }

    var delta     = event.deltaX;
    var elWidth   = this.get('elWidth');
    var threshold = this.get('threshold');
    var prevPane  = this.get('prevPane');
    var nextPane  = this.get('nextPane');

    var animation;

    if (prevPane && delta > threshold) {
      animation = this.animateToNewPane(elWidth, prevPane);

    } else if (delta > 0) {
      animation = this.animateToCurrentPane();

    } else if (nextPane && Math.abs(delta) > threshold) {
      animation = this.animateToNewPane(-elWidth, nextPane);

    } else {
      animation = this.animateToCurrentPane();

    }

    return this.finishAnimation(animation);
  },

  animateToNewPane: function(translateX, pane) {
    var component = this;
    this.set('animating', true);

    return animate(this.get('$container'), {
      translateX: translateX
    }).then(function() {
      component.set('panel.currentPane', pane.get('name'));
    });
  },

  animateToCurrentPane: function() {
    var component = this;
    component.set('animating', true);

    return animate(this.get('$container'), {
      translateX: 0
    }).then(function() {
      return component.get('panel').updateVisiblePane();
    });
  },

  finishAnimation: function(animation) {
    var component = this;

    return Ember.RSVP.resolve(animation).then(function() {
      component.get('reverseCss').forEach(function(reverseFn) {
        return reverseFn();
      });

      component.get('$container').css({
        transform: 'translateX(0px)'
      });
    }).then(function() {
      component.set('animating', false);
    });
  },

  showAndSetCss: function(el, cssOpts) {
    if (!el) {
      return;
    }

    var $el = el.$();

    this.setCss($el, cssOpts);
    $el.removeClass('hide');
  },

  // We need to set the height to the max height out of ALL the panes. If
  // it's shorter than one, it will look cut off during the drag
  //
  // We also do this hacky one time cache because it takes ~45ms to
  // calculate this and causes the drag to lag
  calculateMaxPaneHeight: function() {
    var maxHeight = this.get('maxHeight');

    if (!maxHeight) {
      maxHeight = this.get('panes').reduce(function(height, pane) {
        var paneHeight = pane.$().outerHeight();

        if (paneHeight > height) {
          return paneHeight;
        }

        return height;
      }, 0);

      this.set('maxHeight', maxHeight);
    }

    return maxHeight;
  },

  setCss: function($el, opts) {
    var reverseFn = setCss($el, opts);
    return this.get('reverseCss').pushObject(reverseFn);
  },

  _hideAnimation: function() {
    return this.$().addClass('hide');
  },

  _showAnimation: function() {
    return this.$().removeClass('hide');
  }
});

function animate($el, opts) {
  return Ember.$.Velocity($el, opts, 375, [400, 25]);
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

