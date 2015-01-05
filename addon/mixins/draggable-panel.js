import Ember from 'ember'
import animate from '../utils/animate';

// Can only be mixed into ps-panel
export default Ember.Mixin.create({
  setupPanHammer: Ember.on('didInsertElement', function() {
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

  threshold: Ember.computed('paneWidth', function() {
    return this.get('elWidth') * 0.30
  }),

  panstart: function(/* event */) {
    this.absolutePositionPanes();
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
  }
});
