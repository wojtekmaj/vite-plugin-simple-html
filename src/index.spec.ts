import { describe, expect, it } from 'vitest';

import simpleHtmlPlugin from './index.js';

import type { HtmlTagDescriptor } from 'vite';

describe('simpleHtmlPlugin()', () => {
  describe('EJS variables', () => {
    it('should replace EJS variables properly', async () => {
      const html = '<html><title><%= title %></title></html>';
      const data = { title: 'Hello world!' };

      const result = await simpleHtmlPlugin({ inject: { data } }).transformIndexHtml.handler(html);

      expect(result).toBe('<html><title>Hello world!</title></html>');
    });

    it('should replace EJS variables properly with HTML content', async () => {
      const html =
        '<html><head><title>Hello world!</title></head><body><%= footer %></body></html>';
      const data = { footer: '<footer>Footer</footer>' };

      const result = await simpleHtmlPlugin({ inject: { data } }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ inject: { tags } }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ inject: { tags } }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ inject: { tags } }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ inject: { tags } }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ inject: { tags } }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin().transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ minify: true }).transformIndexHtml.handler(html);

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

      const result = await simpleHtmlPlugin({ minify: true }).transformIndexHtml.handler(html);

      expect(result).toBe('<html><head><title>Hello world!</title></head><body></body></html>');
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

      const result = await simpleHtmlPlugin({ minify: true }).transformIndexHtml.handler(html);

      expect(result).toBe(
        '<html><head><style>body{background-color:red}</style></head><body></body></html>',
      );
    });

    it('should not minify JS properly by default given minify = true', async () => {
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

      const result = await simpleHtmlPlugin({ minify: true }).transformIndexHtml.handler(html);

      expect(result).toBe(
        `<html><head><script>if (true) {
        console.log('Hello world!');
      }</script></head><body></body></html>`,
      );
    });

    it('should minify JS properly given minifyJS = true', async () => {
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

      const result = await simpleHtmlPlugin({
        minify: {
          collapseWhitespace: true,
          minifyJS: true,
        },
      }).transformIndexHtml.handler(html);

      expect(result).toBe(
        '<html><head><script>console.log("Hello world!")</script></head><body></body></html>',
      );
    });
  });
});
