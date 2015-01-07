import Ember from 'ember'

// The parent must mixin ParentRegistrar
export default Ember.Mixin.create({
  parentName: 'parent', // class can override this to give it a different name

  __registerWithParent: Ember.on('didInsertElement', function() {
    this.get(this.get('parentName')).__registerChild(this);
  }),

  __deregisterWithParent: Ember.on('willDestroyElement', function() {
    this.get(this.get('parentName')).__unregisterChild(this);
  }),
});
