ember-resize-aware
==============================================================================

Simplified and updated version of `ember-resize`.
Provides a mixin that you can use on your components, your components will have a `didResize` event called on them when appropriate.

Installation
------------------------------------------------------------------------------

```
ember install ember-resize-aware
```


Usage
------------------------------------------------------------------------------

Just mix this sucker into a component or any ember object with the `didInsertElement` lifecycle hooks.

```javascript
import Component from '@ember/component';
import ResizeAware from 'ember-resize-aware/mixins/resize-aware';

export default Component.extend(ResizeAware, {
  debounceRate: 400, // You can optionally set the debounce rate, the default is 200, 0 during testing.

  didResize(width, height, event) {
    // YOU GET THE WIDTH! AND THE HEIGHT! AND THE ORIGINAL EVENT!
  },
});
```


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-resize-aware`
* `yarn install`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `yarn test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
