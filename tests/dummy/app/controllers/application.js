import Ember from 'ember';
import initializePanes from 'ember-cli-panels/utils/initialize-panes';
import { animate } from 'liquid-fire';

export default Ember.Controller.extend({
  queryParams: ['pane'],
  pane: 'panes/users',

  panes: initializePanes([
    'panes/users', 'panes/contacts'
  ]),

  showAnimation: function() {
    return animate(this, {translateX: 0, opacity: 1}, {}, 'show ps-pane');
  },

  hideAnimation: function() {
    return animate(this, {translateX: -100, opacity: 0}, {}, 'hide ps-pane');
  },

  actions: {
    switchPane: function(name) {
      this.set('pane', name);
    }
  }
});
