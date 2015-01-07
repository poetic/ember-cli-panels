import Ember from 'ember';

export default function(componentName, errMsg) {
  if (!errMsg) {
    errMsg = '';
  }

  return Ember.computed(function() {
    function tryParentContext(parent) {
      var parentComponentName = getComponentName(parent);

      if (parentComponentName === componentName) {
        return parent;
      }

      var parentsParent = parent.get('parentView');

      if (parentsParent) {
        return tryParentContext(parentsParent);
      }

      throw new Ember.Error('Could not find parent component named ' + componentName + ' to return. ' + errMsg);
    }

    return tryParentContext(this.get('parentView'));
  });
}

function getComponentName(component) {
  var name = component.toString();

  if (name.indexOf('@component') > -1) {
    return name.split(':')[1];
  }

  return false;
}
