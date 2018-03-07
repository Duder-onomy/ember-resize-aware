import Component from '@ember/component';
import ResizeAwareMixin from 'ember-resize-aware/mixins/resize-aware';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
import { set } from '@ember/object';

moduleForComponent('Unit | Mixin | resize-aware', {
  integration: true,
  beforeEach() {
    const testContext = this;

    this.register('component:resize-aware-component',
      Component.extend(ResizeAwareMixin, {
        init() {
          this._super(...arguments);
          testContext.componentInstance = this;
        }
      })
    );
  }
});

test('didResize hook is on the object', function(assert) {
  this.render(hbs`{{resize-aware-component}}`);
  let resizeAwareComponent = this.componentInstance;

  assert.ok(resizeAwareComponent.didResize, 'didResize hook is present on the subject');
  assert.equal(typeof resizeAwareComponent.didResize, 'function', 'didResize hook is a function');
});

test('it fires "didResize"  when the window is resized', function(assert) {
  let didResizeCallCount = 0;

  this.didResize = function() {
    didResizeCallCount++;
  };

  this.debounceRate = 0;

  this.render(hbs`{{resize-aware-component didResize=didResize debounceRate=debounceRate}}`);
  let resizeAwareComponent = this.componentInstance;

  let evt = new window.Event('resize');

  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 1, 'didResize called 1 time on event firing');

  set(resizeAwareComponent, '_previousWidth', 0);

  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 2, 'didResize called another time on event firing again');
});
