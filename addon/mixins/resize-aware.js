import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get, setProperties } from '@ember/object';
import { debounce, next } from '@ember/runloop';
import { tryInvoke } from '@ember/utils';
import Ember from 'ember';

const isTesting = Ember.testing;

export default Mixin.create({
  unifiedEventHandler: service(),
  resizeObserver: service(),

  didResize(/*width, height*/) {}, // Overridden in subclass
  debounceRate: 200, // Overridden in subclass

  _previousWidth: null,
  _previousHeight: null,

  didInsertElement(...args) {
    this._super(...args);

    if (window.ResizeObserver) {
      get(this, 'resizeObserver').register(this, this._handleResizeEvent);
    } else {
      this._handleResizeEvent = this._handleResizeEvent.bind(this);
      get(this, 'unifiedEventHandler').register('window', 'resize', this._handleResizeEvent);
    }
  },

  willDestroyElement(...args) {
    this._super(...args);
    get(this, 'unifiedEventHandler').unregister('window', 'resize', this._handleResizeEvent);
  },

  _handleResizeEvent(newWidth, newHeight) {
    debounce(this, this._debouncedResizeEvent, newWidth, newHeight, isTesting ? 0 : get(this, 'debounceRate'));
  },

  _debouncedResizeEvent(newWidth, newHeight) {
    // nativeResize observers will give us the clientRect
    // So lets avoid calling getBoundingClientRect as that will force layout calculation
    if (!newWidth && !newHeight) {
      const boundingRect = this.element.getBoundingClientRect();

      newWidth = Math.floor(boundingRect.width);
      newHeight = Math.floor(boundingRect.height);
    }

    if ((get(this, '_previousWidth') !== newWidth) || (get(this, '_previousHeight') !== newHeight)) {
      next(this, () => !get(this, 'isDestroyed') && tryInvoke(this, 'didResize', [newWidth, newHeight]));
      setProperties(this, {
        _previousWidth: newWidth,
        _previousHeight: newHeight
      });
    }
  }
});
