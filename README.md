# PostCSS Variable Compress ![npm](https://img.shields.io/npm/dy/postcss-variable-compress) ![GitHub branch checks state](https://img.shields.io/github/checks-status/navanshu/postcss-variable-compress/master)

## These are Docs of V4.0.0 which will be releasing soon, kindly refer to [Old Docs V3.0.0](https://github.com/navanshu/postcss-variable-compress/tree/87e6479e2f0a5959fd0a5c7536f4548fb950a8e2)

[postcss-variable-compress] is a [PostCSS] plugin that minifies variable names and saves space in your CSS. It compresses CSS variables while ensuring that your stylesheet remains intact. Even if you have 1295 CSS variables, their names will not exceed two characters. Get it from [NPM].

[postcss]: https://github.com/postcss/postcss
[postcss-variable-compress]: https://github.com/navanshu/postcss-variable-compress
[npm]: https://www.npmjs.com/package/postcss-variable-compress

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

Usage
Step 1: Install the plugin:

```sh
npm install --save-dev postcss postcss-variable-compress
```

Step 2: Check your project for an existing PostCSS config: postcss.config.js in the project root, "postcss" section in package.json, or postcss in the bundle config.

If you do not use PostCSS, add it according to the official docs and configure this plugin accordingly.

Step 3: Add the plugin at the end of the plugins list:

```diff
module.exports = {
  plugins: [
    require('cssnano'),
+   require('postcss-variable-compress')
  ]
}

```
## Options

The postcss-variable-compress function accepts the following options:

* `preserveVariables` (optional): An array of variable names or skip functions to preserve from compression.

  * Variable names: Provide the names of variables as strings that you want to preserve. For example: `['color-red', 'font-size']`.

  * Skip functions: Provide skip functions that take a variable name as a parameter and return true to skip the variable, or false/undefined to process it. For example:

    ```javascript
    function skipFunction(variableName) {
      return variableName.startsWith('skip-');
    }
    ```

* `history` (optional): When true is provided, changes are kept the same in subsequent builds. When a string path is provided, the list of variables will remain the same across builds, stored in the specified file.

### Example Usage

```javascript
module.exports = {
  plugins: [
    require('cssnano'),
    require('postcss-variable-compress')(
      // Pass CSS variables to avoid compression
      'light', 'dark', 'font', 'vh', 'r' // Unprefixed
      // or
      '--height', '--font' // Prefixed
      // or pass in as many functions as you want
      // They take a single parameter, which is the name of the CSS variable
      // You can perform checks on the name and
      // return true if you want it to be skipped
      // For example:
      (name) => name.includes('skip') // Prefixed CSS variable example: --height
      // Avoid using regex if possible, as they can be less efficient
    )
  ]
}
```

* The history option in postcss-variable-compress allows you to maintain a consistent list of variables across different builds by storing them in a JSON file. When a string path is provided for the history option, the plugin will load the build history from the specified file and ensure that the variables remain the same in subsequent builds.

* This feature is particularly useful when working in a team or using version control systems like Git. By storing the variables in a file, you can track changes to the variables over time and easily share the list of variables with your team members.

### To utilize the history / same variables accross builds effectively, follow these steps:

1. Specify the path where you want to store the build history JSON file. For example, you can use a file path like "buildHistory/postcssVariableCompress.json".

2. Include the path as the value for the history option when configuring the postcss-variable-compress plugin in your PostCSS setup.

  ```javascript
  module.exports = {
    plugins: [
      require('postcss-variable-compress')(
        // Other options...
        {
          history: 'buildHistory/postcssVariableCompress.json',
        }
      ),
    ],
  };
  ```

3. Make sure to create the directory specified in the history option before running the PostCSS build. For example, create the buildHistory directory.

4. Add the build history JSON file to your version control system (e.g., Git) to track changes over time.

__Note: It's a good practice to add the build history file to the .gitignore file or any other relevant ignore file to exclude it from being formatted by tools like Prettier. This ensures that the file remains readable and understandable in its Pretty format.__

By utilizing the history option and storing the variables in a JSON file, you can maintain consistency in your CSS variable names across builds, track changes to the variables over time, and collaborate effectively with your team members.

[official docs]: https://github.com/postcss/postcss#usage
