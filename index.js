/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-cli-panels'

  included: function(app) {
    app.import(path.join(app.bowerDirectory, 'hammer.js', 'hammer.js'));
  }
};
