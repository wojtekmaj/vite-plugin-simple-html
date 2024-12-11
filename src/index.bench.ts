import { bench, describe } from 'vitest';
import { asyncReduce } from '@wojtekmaj/async-array-utils';

import simpleHtmlPlugin from './index.js';

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

describe('simpleHtmlPlugin', () => {
  bench('simple', async () => {
    const html = `<html>
<head>
  <title>Hello world!</title>
</head>
<body>
</body>
</html>`;

    await runPlugin(html);
  });

  bench('EJS variables', async () => {
    const html = '<html><title><%= title %></title></html>';
    const data = { title: 'Hello world!' };

    await runPlugin(html, { inject: { data } });
  });

  bench('no minification', async () => {
    const html = `<html>
<head>
  <title>Hello world!</title>
</head>
<body>
</body>
</html>`;

    await runPlugin(html, { minify: false });
  });
});
