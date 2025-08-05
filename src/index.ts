import htmlPlugin from './htmlPlugin.js';
import minifyPlugin, { defaultMinifyOptions } from './minifyPlugin.js';

import type { Options as SwcHtmlOptions } from '@swc/html';
import type { HtmlTagDescriptor } from 'vite';

type Options = {
  inject?: {
    data?: Record<string, string>;
    tags?: HtmlTagDescriptor[];
  };
  minify?: boolean | SwcHtmlOptions;
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
