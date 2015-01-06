module.exports = {
  normalizeEntityName: function() { },

  afterInstall: function() {
    var blueprint = this;

    return blueprint.addPackageToProject('liquid-fire', '~0.16.0').then(function() {
      return blueprint.addBowerPackageToProject([
        { name: 'hammer.js', target: '^2.0.4' },
        { name: 'jquery-scrollstop', target: '~1.1.0' }
      ]);
    });
  }
}
