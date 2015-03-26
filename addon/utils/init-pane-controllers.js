import Ember from 'ember';

export default function initPaneControllers(paneNames) {
  return Ember.computed(function() {
    return paneNames.map(function(paneName) {
      return this.container.lookup('controller:' + paneName);
    }, this);
  });
}
