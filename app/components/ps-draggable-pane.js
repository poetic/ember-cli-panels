import Ember from 'ember';
import PsPane from './ps-pane';

export default PsPane.extend({
  _hideAnimation: function() {
    return this.$().addClass('hide');
  },

  _showAnimation: function() {
    return this.$().removeClass('hide');
  }
});
