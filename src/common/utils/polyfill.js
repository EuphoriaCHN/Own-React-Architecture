// Number
require('core-js/es6/number');
// String
require('core-js/fn/string/includes');
require('core-js/fn/string/starts-with');
require('core-js/fn/string/ends-with');

require('core-js/es6/array');
require('core-js/fn/array/includes');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');
require('core-js/fn/object/values');
require('core-js/fn/object/entries');

// ：Map && Set
require('core-js/es6/map');
require('core-js/es6/set');

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}
