import Component from '@ember/component';
import { setProperties } from '@ember/object';
import ResizeAware from 'ember-resize-aware/mixins/resize-aware';
import layout from './template';

export default Component.extend(ResizeAware, {
  layout,

  width: null,
  height: null,

  didInsertElement(...args) {
    const boundingRect = this.element.getBoundingClientRect();

    setProperties(this, {
      width: boundingRect.width,
      height: boundingRect.height,
    });

    this._super(...args);
  },

  didResize(width, height) {
    setProperties(this, {
      width,
      height,
    });
  },
});
