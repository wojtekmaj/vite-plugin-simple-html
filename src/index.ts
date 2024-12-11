import htmlPlugin from './htmlPlugin.js';
import minifyPlugin, { defaultMinifyOptions } from './minifyPlugin.js';

import type { HtmlTagDescriptor } from 'vite';
import type { Options as HtmlMinifierTerserOptions } from 'html-minifier-terser';

type Options = {
  inject?: {
    data?: Record<string, string>;
    tags?: HtmlTagDescriptor[];
  };
  minify?: boolean | HtmlMinifierTerserOptions;
};

export default function simpleHtmlPlugin(options?: Options): {
  name: string;
  transformIndexHtml: {
    order: 'pre' | 'post';
    handler: (html: string) => Promise<string>;
  };
}[] {
  return [htmlPlugin(options), minifyPlugin(options)];
}

export { defaultMinifyOptions };
