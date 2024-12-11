[![npm](https://img.shields.io/npm/v/vite-plugin-simple-html.svg)](https://www.npmjs.com/package/vite-plugin-simple-html) ![downloads](https://img.shields.io/npm/dt/vite-plugin-simple-html.svg) [![CI](https://github.com/wojtekmaj/vite-plugin-simple-html/actions/workflows/ci.yml/badge.svg)](https://github.com/wojtekmaj/vite-plugin-simple-html/actions)

# vite-plugin-simple-html

Vite plugin for HTML processing and minification. "Lite" version of [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html), supporting a [subset](#detailed-comparison-with-vite-plugin-html) of its features.

## tl;dr

- Install by executing `npm install vite-plugin-simple-html` or `yarn add vite-plugin-simple-html`.
- Import by adding `import simpleHtmlPlugin from 'vite-plugin-simple-html'`.
- Use it by adding `simpleHtmlPlugin()` to `plugins` section of your Vite config.

## Usage

Here's an example of basic configuration:

```ts
import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';

export default defineConfig({
  plugins: [
    simpleHtmlPlugin({
      inject: {
        data: {
          title: 'My app',
          script: '<script src="index.js"></script>',
        },
        tags: [
          {
            tag: 'meta',
            attrs: {
              name: 'description',
              content: 'My awesome app',
            },
          },
        ],
      },
      minify: true,
    }),
  ],
});
```

## User guide

### Minification

Minification is handled by [@swc/html](https://www.npmjs.com/package/@swc/html).

To minify your HTML files, set `minify` to `true`:

```ts
import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';

export default defineConfig({
  plugins: [
    simpleHtmlPlugin({
      minify: true,
    }),
  ],
});
```

The default configuration in this case is:

```js
{
  collapseWhitespaces: 'all',
  minifyCss: true,
  minifyJs: false,
  minifyJson: true,
  quotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: 'all',
  tagOmission: false,
}
```

You can access that configuration by importing `defaultMinifyOptions` from the plugin:

```ts
import { defaultMinifyOptions } from 'vite-plugin-simple-html';
```

> [!NOTE]
> The default configuration is designed for compatibility with vite-plugin-html. For more aggressive minification, consider adjusting the settings to better suit your needs.

If you want to customize the minification process, for example to minify JS, you can pass your own configuration object:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    simpleHtmlPlugin({
      minify: {
        minifyJs: true,
      },
    }),
  ],
});
```

For a full list of available options, refer to [@swc/html documentation](https://swc.rs/docs/usage/html).

### EJS variables support

You can inject variables into your HTML files using EJS syntax.

```ts
import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';

export default defineConfig({
  plugins: [
    simpleHtmlPlugin({
      inject: {
        data: {
          title: 'My app',
        },
      },
    }),
  ],
});
```

```html
<!doctype html>
<html lang="en">
  <head>
    <title><%= title %></title>
  </head>
  <body>
    <h1><%= title %></h1>
  </body>
</html>
```

### Tag injection

You can inject tags into your HTML files.

```ts
import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';

export default defineConfig({
  plugins: [
    simpleHtmlPlugin({
      inject: {
        tags: [
          {
            tag: 'meta',
            attrs: {
              name: 'description',
              content: 'My awesome app',
            },
          },
        ],
      },
    }),
  ],
});
```

By default, they are injected at the end of the `<head>` section of your HTML file. You can change that behavior by setting `injectTo`:

- `head`: Injects tags at the end of the `<head>` section of your HTML file (default).
- `head-prepend`: Injects tags at the beginning of the `<head>` section of your HTML file.
- `body`: Injects tags at the end of the `<body>` section of your HTML file.
- `body-prepend`: Injects tags at the beginning of the `<body>` section of your HTML file.

## Detailed comparison with [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)

| Feature                  | vite-plugin-simple-html | vite-plugin-html |
| ------------------------ | ----------------------- | ---------------- |
| EJS support              | ⚠️ Variables only       | ✅               |
| HTML tags injection      | ✅                      | ✅               |
| HTML/CSS/JS minification | ✅                      | ✅               |
| JSON minification        | ✅                      | ❌               |
| entry script injection   | ❌                      | ✅               |
| template customization   | ❌                      | ✅               |
| multi-page support       | ❌                      | ✅               |

### Why bother?

- `vite-plugin-simple-html` has considerably fewer dependencies. Compare:
  - [`vite-plugin-html` dependency graph](https://npmgraph.js.org/?q=vite-plugin-html)
  - [`vite-plugin-simple-html` dependency graph](https://npmgraph.js.org/?q=vite-plugin-simple-html)
- `vite-plugin-simple-html` does not suffer from [issue that breaks Vite proxy](https://github.com/vbenjs/vite-plugin-html/issues/38) (which was the reason I created this plugin in the first place).
- `vite-plugin-simple-html` does not use options deprecated in Vite 5, and thus does not produce deprecation warnings:

  ```
   WARN  plugin 'vite:html' uses deprecated 'enforce' option. Use 'order' option instead.

   WARN  plugin 'vite:html' uses deprecated 'transform' option. Use 'handler' option instead.
  ```

## License

The MIT License.

## Author

<table>
  <tr>
    <td >
      <img src="https://avatars.githubusercontent.com/u/5426427?v=4&s=128" width="64" height="64" alt="Wojciech Maj">
    </td>
    <td>
      <a href="https://github.com/wojtekmaj">Wojciech Maj</a>
    </td>
  </tr>
</table>
