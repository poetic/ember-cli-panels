import Ember from 'ember';

export default function initializePanes(paneNames) {
  return Ember.computed(function() {
    return paneNames.map(function(paneName) {
      return this.container.lookup('controller:' + paneName);
    }, this);
  });
}
