import Ember from 'ember';
import Pane from 'ember-cli-panels/controllers/pane';

export default Pane.extend({
  modelHook: function() {
    return this.store.find('contact');
  }
});
