# PostCSS Variable Compress ![npm](https://img.shields.io/npm/dy/postcss-variable-compress) ![GitHub branch checks state](https://img.shields.io/github/checks-status/navanshu/postcss-variable-compress/master)

[postcss-variable-compress] is a [PostCSS] plugin minifies variable names and saves space. Even if you have 1295 css variables still they will not exceed by two characters. It will transform css variable without breaking your stylesheet. Get if from [NPM].

If you want it not modify some css variables, then pass them `--{variable-name}` as an array to the plugin.

[postcss]: https://github.com/postcss/postcss
[postcss-variable-compress]: https://github.com/navanshu/postcss-variable-compress
[npm]: https://www.npmjs.com/package/postcss-variable-compress

### If you are looking for a plugin that can work on separate files go to import splitFiles.js, works the same but it doesn't resets the variables.

```css
:root {
  --first-color: #16f;
  --second-color: #ff7;
}

#firstParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}

#container {
  --first-color: #290;
}
```

```css
:root {
  --0: #16f;
  --1: #ff7;
}

#firstParagraph {
  background-color: var(--0);
  color: var(--1);
}

#container {
  --0: #290;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-variable-compress
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin at the end of the plugins list:

```diff
module.exports = {
  plugins: [
    require('cssnano'),
+   require('postcss-variable-compress')
  ]
}
```

## Api

```javascript

module.exports = {
  plugins: [
    require('cssnano'),
    require('postcss-variable-compress')(
      // pass in css variables to avoid
      'light', 'dark', 'font', 'vh', 'r' // unprefixed
      // or
      '--height', '--font' // prefixed
      // or pass in as many function as your want
      // they take single param which is a the name of css variable
      // you can do checks on it and
      // return true if you want it to be skipped
      // for example
      (name) => name.includes('skip') // name prefixed css variable example --height
      // avoid regex if you can they are bad
    )
  ]
}

```

[official docs]: https://github.com/postcss/postcss#usage
