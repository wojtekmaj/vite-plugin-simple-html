[![npm](https://img.shields.io/npm/v/vite-plugin-simple-html.svg)](https://www.npmjs.com/package/vite-plugin-simple-html) ![downloads](https://img.shields.io/npm/dt/vite-plugin-simple-html.svg) [![CI](https://github.com/wojtekmaj/vite-plugin-simple-html/actions/workflows/ci.yml/badge.svg)](https://github.com/wojtekmaj/vite-plugin-simple-html/actions)

# vite-plugin-simple-html

Vite plugin for HTML processing and minification. "Lite" version of [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html), supporting a subset of its features.

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
      minify: true,
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

### EJS syntax support

You can use EJS syntax in your HTML files.

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
    }),
  ],
});
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
