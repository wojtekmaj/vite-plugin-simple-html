import type { HtmlTagDescriptor, PluginOption } from 'vite';

type Options = {
  inject?: {
    data?: Record<string, string>;
    tags?: HtmlTagDescriptor[];
  };
};

export default function htmlPlugin({ inject }: Options = {}): {
  name: string;
  transformIndexHtml: {
    order: 'pre';
    handler: (html: string) => Promise<string>;
  };
} {
  return {
    name: 'vite:simple-html:ejs',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html: string) => {
        const { data, tags } = inject || {};

        let result = html;

        // Replace ejs variables
        if (data) {
          for (const [key, value] of Object.entries(data)) {
            result = result.replaceAll(new RegExp(`<%= ${key} %>`, 'g'), value);
          }
        }

        // Inject meta tags
        if (tags) {
          for (const tag of tags) {
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
                throw new Error(`Unknown injectTo value: ${injectTo satisfies never}`);
            }
          }
        }

        return result;
      },
    },
  } satisfies PluginOption;
}
