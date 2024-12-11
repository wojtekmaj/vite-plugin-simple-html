import { minify } from '@swc/html';

import type { HtmlTagDescriptor, PluginOption } from 'vite';
import type { Options as SwcHtmlOptions } from '@swc/html';

type Options = {
  inject?: {
    data?: Record<string, string>;
    tags?: HtmlTagDescriptor[];
  };
  minify?: boolean | SwcHtmlOptions;
};

export const defaultMinifyOptions: SwcHtmlOptions = {
  collapseWhitespaces: 'all',
  minifyCss: true,
  minifyJs: false,
  minifyJson: true,
  quotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: 'all',
  tagOmission: false,
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
          ({ code: result } = await minify(
            result,
            minifyOptions === true ? defaultMinifyOptions : minifyOptions,
          ));
        }

        return result;
      },
    },
  } satisfies PluginOption;
}
