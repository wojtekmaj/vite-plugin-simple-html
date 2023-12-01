import { minify } from 'html-minifier-terser';

import type { HtmlTagDescriptor, PluginOption } from 'vite';
import type { Options as HtmlMinifierTerserOptions } from 'html-minifier-terser';

type Options = {
  inject?: {
    data?: Record<string, string>;
    tags?: HtmlTagDescriptor[];
  };
  minify?: boolean | HtmlMinifierTerserOptions;
};

const defaultMinifyOptions: HtmlMinifierTerserOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
};

export default function simpleHtmlPlugin({ inject, minify: minifyOptions = false }: Options = {}) {
  return {
    name: 'vite:simple-html',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html: string) => {
        const { data, tags } = inject || {};

        let result = html;

        // Replace ejs variables
        if (data) {
          Object.entries(data).forEach(([key, value]) => {
            result = result.replaceAll(new RegExp(`<%= ${key} %>`, 'g'), value);
          });
        }

        // Inject meta tags
        if (tags) {
          tags.forEach((tag) => {
            const { tag: tagName, attrs, injectTo = 'head' } = tag;

            let tagString = `<${tagName}${
              attrs
                ? ` ${Object.entries(attrs || {})
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ')}`
                : ''
            }>`;
            if (tagName !== 'link' && tagName !== 'meta') {
              tagString += `</${tagName}>`;
            }

            switch (injectTo) {
              case 'head':
                result = result.replace(/<\/head>/, `${tagString}</head>`);
                break;
              case 'head-prepend':
                result = result.replace(/<head>/, `<head>${tagString}`);
                break;
              case 'body':
                result = result.replace(/<\/body>/, `${tagString}</body>`);
                break;
              case 'body-prepend':
                result = result.replace(/<body>/, `<body>${tagString}`);
                break;
              default:
                throw new Error(`Unknown injectTo value: ${injectTo}`);
            }
          });
        }

        if (minifyOptions) {
          result = await minify(
            result,
            typeof minifyOptions === 'object' ? minifyOptions : defaultMinifyOptions,
          );
        }

        return result;
      },
    },
  } satisfies PluginOption;
}
