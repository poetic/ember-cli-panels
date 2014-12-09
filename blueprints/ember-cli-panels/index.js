module.exports = {
  normalizeEntityName: function() { return null; },

  afterInstall: function() {
    var blueprint = this;
    return this.addPackageToProject('liquid-fire').then(function() {
      return blueprint.addBowerPackageToProject('hammer.js', '^2.0.4');
    });
  }
}
