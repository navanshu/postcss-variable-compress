# PostCSS Variable Compress

[postcss-variable-compress] is a [PostCSS] plugin minifies variable names and saves space. Even if you have 1295 css variables still they will not exceed by two characters. It will transform css variable without breaking your stylesheet.

If you want it not modify some css variables, then pass them `--{variable-name}` as an array to the plugin.

[postcss]: https://github.com/postcss/postcss
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

**Step 4:** Pass configuration to the plugin. It takes an array of css variables that you don't need to transform.

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
