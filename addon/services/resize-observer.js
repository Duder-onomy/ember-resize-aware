import Service from '@ember/service';
import { run } from '@ember/runloop';

export default Service.extend({
  _resizeObserver: null,
  init(...args) {
    this._super(...args);
    this.runloopAwareMeasure = (entries) => run(this, this.handleObserverResize, entries);
  },
  getResizeObserverInstance() {
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(this.runloopAwareMeasure);
    }

    return this._resizeObserver;
  },
  register(component, callback) {
    component.element.handleResize = callback.bind(component);

    this.getResizeObserverInstance().observe(component.element);

    component.willDestroy = (...args) => {
      component.element.handleResize = null;
      this.getResizeObserverInstance().disconnect(component.element);
      this._super(...args);
    };
  },
  handleObserverResize(entries) {
    entries.forEach((entry) => {
      if (entry.target.handleResize) {
        entry.target.handleResize(entry.contentRect.width, entry.contentRect.height);
      }
    });
  },
});
