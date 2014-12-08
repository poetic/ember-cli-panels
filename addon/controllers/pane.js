import Ember from 'ember';

export default Ember.Controller.extend({
  modelHook: function() {
    return null;
  },

  partialName: Ember.computed.alias('name'),

  name: Ember.computed(function() {
    return this.toString().split(':')[1];
  }),

  setupModel: Ember.on('init', function() {
    var pane = this;
    this.set('loading', true);

    Ember.RSVP.resolve(this.modelHook()).then(function(model) {
      if (model) {
        pane.set('model', model);
      }
    }, function(err) {
      console.log('modelHook error:', err);
    }).finally(function() {
      pane.set('loading', false);
    });
  })
});
