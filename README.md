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
          title: 'My App',
        },
        tags: [
          {
            tag: 'meta',
            attrs: {
              name: 'description',
              content: 'My awesome App',
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

HTML minification is done using [html-minifier-terser](https://github.com/terser/html-minifier-terser).

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
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
}
```

If you want to customize the minification process, for example to minify JS, you can pass your own configuration object:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    simpleHtmlPlugin({
      minify: {
        minifyJS: true,
      },
    }),
  ],
});
```

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
          title: 'My App',
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
              content: 'My awesome App',
            },
          },
        ],
      },
    }),
  ],
});
```

## Detailed comparison with [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)

| Feature                  | vite-plugin-simple-html | vite-plugin-html |
| ------------------------ | ----------------------- | ---------------- |
| EJS variables support    | ✅                      | ✅               |
| Full EJS support         | ❌                      | ✅               |
| HTML tags injection      | ✅                      | ✅               |
| HTML/CSS/JS minification | ✅                      | ✅               |
| entry script injection   | ❌                      | ✅               |
| template customization   | ❌                      | ✅               |
| multi-page support       | ❌                      | ✅               |

### Why bother?

- `vite-plugin-simple-html` has fewer dependencies.
- `vite-plugin-simple-html` does not suffer from [issue that breaks Vite proxy](https://github.com/vbenjs/vite-plugin-html/issues/38) (which was the reason I created this plugin in the first place).
- `vite-plugin-simple-html` does not use options deprecated in Vite 5, and thus does not produce deprecation warnings.

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
