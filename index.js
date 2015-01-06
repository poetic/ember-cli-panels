/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-cli-panels',
  isDevelopingAddon: function() {
    return true;
  },

  included: function(app) {
    app.import(path.join(app.bowerDirectory, 'hammer.js', 'hammer.js'));
    app.import(path.join(app.bowerDirectory, 'jquery-scrollstop', 'jquery.scrollstop.js'));
  }
};
