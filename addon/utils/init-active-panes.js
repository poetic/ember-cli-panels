import Ember from 'ember';

export default function initActivePanes(currentPane, paneNames) {
  return Ember.on('init', function() {
    paneNames.forEach(function(paneName) {
      var split = paneName.split('/');
      var name = split[split.length - 1];

      var propName = Ember.String.camelize(name + 'Active');

      Ember.defineProperty(this, propName,
                          Ember.computed.equal(currentPane, paneName));
    }, this);
  });
}
