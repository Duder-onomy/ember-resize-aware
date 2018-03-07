import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get, setProperties } from '@ember/object';
import { debounce, bind, next } from '@ember/runloop';
import { tryInvoke } from '@ember/utils';
import Ember from 'ember';

const isTesting = Ember.testing;

export default Mixin.create({
  unifiedEventHandler: service(),

  didResize(/*width, height*/) {}, // Overridden in subclass
  debounceRate: 200, // Overridden in subclass

  _previousWidth: null,
  _previousHeight: null,

  init(...args) {
    this._handleResizeEvent = bind(this, this._handleResizeEvent);
    this._super(...args);
  },

  didInsertElement(...args) {
    this._super(...args);
    get(this, 'unifiedEventHandler').register('window', 'resize', this._handleResizeEvent);
  },

  willDestroyElement(...args) {
    this._super(...args);
    get(this, 'unifiedEventHandler').unregister('window', 'resize', this._handleResizeEvent);
  },

  _handleResizeEvent() {
    debounce(this, this._debouncedResizeEvent, isTesting ? 0 : get(this, 'debounceRate'));
  },

  _debouncedResizeEvent() {
    const boundingRect = this.element.getBoundingClientRect();

    const newWidth = Math.floor(boundingRect.width);
    const newHeight = Math.floor(boundingRect.height);

    if ((get(this, '_previousWidth') !== newWidth) || (get(this, '_previousHeight') !== newHeight)) {
      next(this, () => tryInvoke(this, 'didResize', [newWidth, newHeight]));
      setProperties(this, {
        _previousWidth: newWidth,
        _previousHeight: newHeight
      });
    }
  }
});
