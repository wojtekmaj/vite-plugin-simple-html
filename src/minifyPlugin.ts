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

export default function simpleHtmlPlugin({ minify: minifyOptions = false }: Options = {}): {
  name: string;
  transformIndexHtml: {
    order: 'post';
    handler: (html: string) => Promise<string>;
  };
} {
  return {
    name: 'vite:simple-html:minify',
    transformIndexHtml: {
      order: 'post',
      handler: async (html: string) => {
        let result = html;

        if (minifyOptions) {
          result = await minify(
            result,
            minifyOptions === true ? defaultMinifyOptions : minifyOptions,
          );
        }

        return result;
      },
    },
  } satisfies PluginOption;
}
