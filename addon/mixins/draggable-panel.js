import Ember from 'ember'

export default Ember.Mixin.create({
  reverseCss:  Ember.A([]),
  $container:  null,
  $panel:      null,
  elWidth:     0,

  setupHammer: Ember.on('didInsertElement', function() {
    if (!this.get('draggable')) {
      return;
    }

    var panel  = this;

    var panRecognizer = new Hammer.Pan({
      direction: Hammer.DIRECTION_HORIZONTAL
    });

    var hammer = new Hammer(this.$()[0], {
      preset: [panRecognizer]
    });

    hammer.on('panstart', function(event) {
      return panel.panstart(event);
    });

    hammer.on('panmove', function(event) {
        return panel.panmove(event);
    });

    hammer.on('panend', function(event) {
      return panel.panend(event);
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

  threshold: Ember.computed('paneWidth', function() {
    return this.get('elWidth') * 0.30
  }),

  setupJqCache: Ember.on('didInsertElement', function() {
    var $panel = this.$();
    this.set('$panel', $panel);
    this.set('$container', $panel.find('.ps-panel-container'));
  }),

  panstart: function(/* event */) {
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

  panmove: function(event) {
    Ember.$.Velocity(this.get('$container'), {
      translateX: event.deltaX
    }, { duration: 0 });
  },

  panend: function(event) {
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
    this.send('startAnimating');

    var component = this;

    return animate(this.get('$container'), {
      translateX: translateX
    }).then(function() {
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
      component.get('reverseCss').forEach(function(reverseFn) {
        return reverseFn();
      });

      component.get('$container').css({
        transform: 'translateX(0px)'
      });
    }).then(function() {
      component.set('animating', false);
      component.send('stopAnimating');
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

  setCss: function($el, opts) {
    var reverseFn = setCss($el, opts);
    return this.get('reverseCss').pushObject(reverseFn);
  }
});

function animate($el, opts) {
  var ms = 375;

  return Ember.$.Velocity($el, opts, ms, [400, 25]);
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

