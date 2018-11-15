import Component from '@ember/component';
import { set } from '@ember/object';
import ResizeAwareMixin from 'ember-resize-aware/mixins/resize-aware';
import hbs from 'htmlbars-inline-precompile';
import { render, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | pretty color', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    const testContext = this;

    this.owner.register('component:resize-aware-component',
      Component.extend(ResizeAwareMixin, {
        init(...args) {
          this._super(...args);
          testContext.componentInstance = this;
        }
      })
    );
  });

  test('didResize hook is on the object', async function(assert) {
    await render(hbs`{{resize-aware-component}}`);
    let resizeAwareComponent = this.componentInstance;

    assert.ok(resizeAwareComponent.didResize, 'didResize hook is present on the subject');
    assert.equal(typeof resizeAwareComponent.didResize, 'function', 'didResize hook is a function');
  });

  test('it fires "didResize"  when the window is resized', async function(assert) {
    assert.expect(2);

    let didResizeCallCount = 0;

    this.didResize = function() { didResizeCallCount++; };
    this.debounceRate = 0;

    await render(hbs`{{resize-aware-component didResize=didResize debounceRate=debounceRate}}`);
    let resizeAwareComponent = this.componentInstance;

    let evt = new window.Event('resize');

    window.dispatchEvent(evt);

    await settled();

    assert.equal(didResizeCallCount, 1, 'didResize called 1 time on event firing');

    set(resizeAwareComponent, '_previousWidth', 0);

    window.dispatchEvent(evt);

    await settled();

    assert.equal(didResizeCallCount, 2, 'didResize called another time on event firing again');
  });
});
