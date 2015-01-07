import Ember from 'ember'

export default Ember.Mixin.create({
  // class can override this to give it a different name
  childComponentsName: 'children',

  __registerChild: function(child) {
    this.get(this.get('childComponentsName')).unshiftObject(child);
  },

  __unregisterChild: function(child) {
    this.get(this.get('childComponentsName')).removeObject(child);
  },
});
