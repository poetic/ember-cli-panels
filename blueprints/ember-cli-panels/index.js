module.exports = {
  normalizeEntityName: function() { return null; },

  afterInstall: function() {
    return this.addPackageToProject('liquid-fire');
  }
}
