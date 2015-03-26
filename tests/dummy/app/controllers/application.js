import Ember from 'ember';
import initPaneControllers from 'ember-cli-panels/utils/init-pane-controllers';
import { animate } from 'liquid-fire';

export default Ember.Controller.extend({
  queryParams: ['pane'],
  pane: 'panes/users',

  paneControllers: initPaneControllers(['panes/users', 'panes/contacts']),

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
