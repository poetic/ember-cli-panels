import Ember from 'ember';

export default function animate($el, opts, ms) {
  if (ms !== 0 && !ms) {
    ms = 375;
  }

  return Ember.$.Velocity($el, opts, ms);
}
