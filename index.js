/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-cli-panels',
  isDevelopingAddon: function() {
    return true;
  },

  included: function(app) {
    app.import(path.join('vendor', 'ember-cli-panels.css'));
  }
};
