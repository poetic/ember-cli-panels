import Ember from 'ember';
import PsPane from './ps-pane';

export default PsPane.extend({
  _hideAnimation: function() {
    return true;
  },

  _showAnimation: function() {
    this.get('panel').updateContainerWidth(this.width());

    return true;
  },

  width: function() {
    return this.$().outerWidth();
  },

  updateWidth: function(width) {
    return this.$().width(width);
  }
});
