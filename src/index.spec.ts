import { describe, expect, it } from 'vitest';
import { asyncReduce } from '@wojtekmaj/async-array-utils';

import simpleHtmlPlugin from './index.js';

import type { HtmlTagDescriptor } from 'vite';

function runPlugin(
  html: string,
  options?: Parameters<typeof simpleHtmlPlugin>[0],
): Promise<string> {
  const pluginOrArrayOfPlugins = simpleHtmlPlugin(options);

  const arrayOfPlugins = Array.isArray(pluginOrArrayOfPlugins)
    ? pluginOrArrayOfPlugins
    : [pluginOrArrayOfPlugins];

  return asyncReduce(
    arrayOfPlugins,
    (result, plugin) => plugin.transformIndexHtml.handler(result),
    html,
  );
}

describe('simpleHtmlPlugin()', () => {
  describe('EJS variables', () => {
    it('should replace EJS variables properly', async () => {
      const html = '<html><title><%= title %></title></html>';
      const data = { title: 'Hello world!' };

      const result = await runPlugin(html, { inject: { data } });

      expect(result).toBe('<html><title>Hello world!</title></html>');
    });

    it('should replace EJS variables properly with HTML content', async () => {
      const html =
        '<html><head><title>Hello world!</title></head><body><%= footer %></body></html>';
      const data = { footer: '<footer>Footer</footer>' };

      const result = await runPlugin(html, { inject: { data } });

      expect(result).toBe(
        '<html><head><title>Hello world!</title></head><body><footer>Footer</footer></body></html>',
      );
    });
  });

  describe('tag injection', () => {
    it('should inject tags to head properly by default', async () => {
      const html = '<html><head><title>Hello world!</title></head><body></body></html>';
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: {
            name: 'description',
            content: 'Hello world!',
          },
        },
      ];

      const result = await runPlugin(html, { inject: { tags } });

      expect(result).toBe(
        '<html><head><title>Hello world!</title><meta name="description" content="Hello world!"></head><body></body></html>',
      );
    });

    it('should inject tags to head properly', async () => {
      const html = '<html><head><title>Hello world!</title></head><body></body></html>';
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: {
            name: 'description',
            content: 'Hello world!',
          },
          injectTo: 'head',
        },
      ];

      const result = await runPlugin(html, { inject: { tags } });

      expect(result).toBe(
        '<html><head><title>Hello world!</title><meta name="description" content="Hello world!"></head><body></body></html>',
      );
    });

    it('should inject tags to head-prepend properly', async () => {
      const html = '<html><head><title>Hello world!</title></head><body></body></html>';
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: {
            name: 'description',
            content: 'Hello world!',
          },
          injectTo: 'head-prepend',
        },
      ];

      const result = await runPlugin(html, { inject: { tags } });

      expect(result).toBe(
        '<html><head><meta name="description" content="Hello world!"><title>Hello world!</title></head><body></body></html>',
      );
    });

    it('should inject tags to body properly', async () => {
      const html = '<html><head><title>Hello world!</title></head><body></body></html>';
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'script',
          attrs: {
            src: 'main.js',
          },
          injectTo: 'body',
        },
      ];

      const result = await runPlugin(html, { inject: { tags } });

      expect(result).toBe(
        '<html><head><title>Hello world!</title></head><body><script src="main.js"></script></body></html>',
      );
    });

    it('should inject tags to body-prepend properly', async () => {
      const html = '<html><head><title>Hello world!</title></head><body></body></html>';
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'script',
          attrs: {
            src: 'main.js',
          },
          injectTo: 'body-prepend',
        },
      ];

      const result = await runPlugin(html, { inject: { tags } });

      expect(result).toBe(
        '<html><head><title>Hello world!</title></head><body><script src="main.js"></script></body></html>',
      );
    });
  });

  describe('minification', () => {
    it('should not minify HTML by default', async () => {
      const html = `<html>
  <head>
    <title>Hello world!</title>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html);

      expect(result).toBe(html);
    });

    it('should minify HTML properly given minify = true', async () => {
      const html = `<html>
  <head>
    <title>Hello world!</title>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe('<html><head><title>Hello world!</title></head><body></body></html>');
    });

    it('should remove comments properly by default given minify = true', async () => {
      const html = `<html>
  <head>
    <!-- This is a comment -->
    <title>Hello world!</title>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe('<html><head><title>Hello world!</title></head><body></body></html>');
    });

    it('should remove script type attributes properly by default given minify = true', async () => {
      const html = `<html>
  <head>
    <script type="text/javascript">
      console.log('Hello world!');
    </script>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe(
        `<html><head><script>console.log('Hello world!');</script></head><body></body></html>`,
      );
    });

    it('should remove style link type attributes properly by default given minify = true', async () => {
      const html = `<html>
  <head>
    <link rel="stylesheet" type="text/css" href="main.css">
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe(
        '<html><head><link rel="stylesheet" href="main.css"></head><body></body></html>',
      );
    });

    it('should minify CSS properly by default given minify = true', async () => {
      const html = `<html>
  <head>
    <style>
      body {
        background-color: red;
      }
    </style>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe(
        '<html><head><style>body{background-color:red}</style></head><body></body></html>',
      );
    });

    it('should minify JSON properly by default given minify = true', async () => {
      const html = `<html>
  <head>
    <script type="application/json">
      {
        "hello": "world"
      }
    </script>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe(
        '<html><head><script type="application/json">{"hello":"world"}</script></head><body></body></html>',
      );
    });

    it('should not minify JS by default given minify = true', async () => {
      const html = `<html>
  <head>
    <script>
      if (true) {
        console.log('Hello world!');
      }
    </script>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe(
        `<html><head><script>if (true) {
        console.log('Hello world!');
      }</script></head><body></body></html>`,
      );
    });

    it('should minify JS properly given minifyJs = true', async () => {
      const html = `<html>
  <head>
    <script>
      if (true) {
        console.log('Hello world!');
      }
    </script>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, {
        minify: {
          collapseWhitespaces: 'all',
          minifyJs: true,
          tagOmission: false,
        },
      });

      expect(result).toBe(
        '<html><head><script>console.log("Hello world!")</script></head><body></body></html>',
      );
    });

    it('should preserve doctype properly given minify = true', async () => {
      const html = `<!doctype html>
<html>
  <head>
    <title>Hello world!</title>
  </head>
  <body>
  </body>
</html>`;

      const result = await runPlugin(html, { minify: true });

      expect(result).toBe(
        '<!doctype html><html><head><title>Hello world!</title></head><body></body></html>',
      );
    });
  });
});
