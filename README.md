# PostCSS Variable Compress

[postcss-variable-compress] is a [PostCSS] plugin minifies variable names and saves space. It can safely convert for css variable fallback cases as well. It replaces css variables via a counter and converts that counter into base 36 string as javascript inherent implementation is limited to this but beyond such no one would notice a difference as right now even if you have 1295 css variables they will not exceed two characters. It will transform any css variable it encounters without breaking your stylesheet. If you want it doesn't modify some css variables pass them as an array

[PostCSS]: https://github.com/postcss/postcss
[postcss-variable-compress]: https://github.com/navanshu/postcss-variable-compress

```css
:root {
--first-color: #16f;
--second-color: #ff7;
}

#firstParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}

#secondParagraph {
  background-color: var(--second-color);
  color: var(--first-color);
}

#container {
  --first-color: #290;
}

.thirdParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}
```

```css
:root {
--0: #16f;
--1: #ff7;
--2: #000;
}

#firstParagraph {
  background-color: var(--0);
  color: var(--1);
}

#secondParagraph {
  background-color: var(--1);
  color: var(--0);
}

#container {
  --0: #290;
}

.thirdParagraph {
  background-color: var(--0);
  color: var(--1);
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

**Step 4:** Pass configuration to the plugin. It takes an array of css variables that you don't need to transform:

```diff
module.export = {
  plugins: [
    require('cssnano'),
+   require('postcss-variable-compress')([
+       '--colorPrimary',
+       '--colorPrimaryAlpha',
+       '--light',
+       '--dark',
+       '--font',
+       '--vh',
+       '--r'
+   ])
  ]  
}
```

[official docs]: https://github.com/postcss/postcss#usage
