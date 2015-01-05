import Ember from 'ember'

export default Ember.Mixin.create({
  reverseCss:  Ember.A([]),

  reverseCssChanges: function() {
    return this.get('reverseCss').map(function(reverseFn) {
      return reverseFn();
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

