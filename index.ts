export type skipFunction = (variableName: string) => boolean | undefined;
export type variableCompressParameters = skipFunction | string;

const postcssPlugin = "postcss-variable-compress";

let processed = Symbol("processed");
let renamedVariables: string[] = [];
let cssVariables = -1;
let pureSkips: string[] = [];
let scriptBasedSkips: skipFunction[] = [];
let cssVariablesMap = new Map();

function scriptCheck(val: string) {
  const should = scriptBasedSkips.findIndex((E) => E(val));
  return should > -1;
}

function shouldRun(val: string) {
  let should = true;

  if (renamedVariables.indexOf(val) > -1) {
    should = false;
  }

  if (should && scriptCheck(val)) {
    should = false;
  }

  return should;
}

function increase() {
  cssVariables = cssVariables + 1;

  let temp = cssVariables.toString(36);

  pureSkips.forEach((E) => {
    if (E === temp) {
      temp = cssVariables.toString(36);
      cssVariables = cssVariables + 1;
    }
  });
}

function replacer(match: string) {
  if (!shouldRun(match)) return match;
  let exist = cssVariablesMap.get(match);

  if (!exist) {
    exist = "--" + cssVariables.toString(36);
    increase();
    cssVariablesMap.set(match, exist);
    renamedVariables.push(exist);
  }

  return exist;
}

function map(j: import("postcss").Declaration) {
  let prop = j.prop;
  if (prop && j.variable && shouldRun(prop)) {
    let old = prop;
    let exist = cssVariablesMap.get(old);
    if (!exist) {
      exist = "--" + cssVariables.toString(36);
      increase();
      cssVariablesMap.set(old, exist);
      renamedVariables.push(exist);
    }
    prop = exist;
    j.prop = prop;
  }

  let value = j.value;
  if (value && value.includes("var(--") && value.length <= 1000) {
    value = value.replace(/--[\w-_]{1,1000}/g, replacer);
    j.value = value;
  }

  // @ts-ignore
  j[processed] = true;
}

function variableCompress(opts?: variableCompressParameters[]) {
  processed = Symbol("processed");

  renamedVariables = [];
  cssVariables = -1;
  pureSkips = [];
  scriptBasedSkips = [];
  cssVariablesMap = new Map();

  opts?.forEach((E) => {
    if (typeof E === "string") {
      let name = E;
      let cssName = E;

      if (E.slice(0, 2) === "--") {
        name = E.slice(2);
      } else {
        cssName = "--" + E;
      }

      pureSkips.push(name);
      cssVariablesMap.set(cssName, cssName);
    } else scriptBasedSkips.push(E);
  });

  increase();

  return {
    postcssPlugin,
    Declaration: {
      "*": map,
    },
  };
}

module.exports = variableCompress;
module.exports.postcss = true;
export default variableCompress;
