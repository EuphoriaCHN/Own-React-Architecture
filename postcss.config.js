const autoPrefixer = require('autoprefixer');
const flexBugsFix = require('postcss-flexbugs-fixes');

module.exports = {
  plugins: [
    autoPrefixer,
    flexBugsFix({ bug6: false }),
  ]
}