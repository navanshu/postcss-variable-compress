const VariablesMap = new Map();
const History = [];
let Variables = -1;
let Skips = [];
/**
 * @param {string} val
 */
function shouldRun (val) {
  if (History.indexOf(val) > -1) {
    return false;
  }
  return true;
}

function increase () {
  Variables = Variables + 1;
  let temp = Variables.toString(36);
  Skips.forEach(E => {
    if (E === temp) {
      temp = Variables.toString(36);
      Variables = Variables + 1;
    }
  });
}

/**
 * @param {string} match
 */
function replacer (match) {

  if (!shouldRun(match)) return match;
  let exist = VariablesMap.get(match);

  if (!exist) {
    exist = '--' + (Variables).toString(36);
    increase();
    VariablesMap.set(match, exist);
    History.push(exist);
  }

  return exist;
}

/**
 * @param {import('postcss').Declaration} j
 */
function looker (j) {

  let prop = j.prop;

  if (j.variable && shouldRun(prop)) {
    let old = prop;
    let exist = VariablesMap.get(old);
    if (!exist) {
      exist = '--' + Variables.toString(36);
      increase();
      VariablesMap.set(old, exist);
      History.push(exist);
    }
    prop = exist;
  }

  let value = j.value.replace(/--[\w-_]{1,1000}/g, replacer);

  if (prop) j.prop = prop;
  if (value) j.value = value;

}

/**
 * @param {string[]} opts
 */
module.exports = (opts = []) => {

  opts.forEach(E => VariablesMap.set(E, E));
  opts.forEach(E => Skips.push(E.replace('--', '')));

  increase();

  return {
    postcssPlugin: 'postcss-variable-compress',
    Declaration: {
      '*': looker
    }
  };
};

module.exports.postcss = true;
