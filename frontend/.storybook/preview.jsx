import '@plone/volto/config'; // This is the bootstrap for the global config - client side
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import enMessages from '@root/../locales/en.json';
import { initialize, mswLoader } from 'msw-storybook-addon';

import '@root/theme';

// Start MSW — waitUntilReady: false prevents blocking Storybook boot if SW registration fails.
// `serviceWorker.url` is resolved from the current document URL so the
// worker is found both locally (served at `/`) and when Storybook is
// published under a subpath on GitHub Pages (e.g. `/sc-videos/storybook/`).
const basePath =
  typeof window !== 'undefined'
    ? window.location.pathname.replace(/[^/]*$/, '')
    : '/';
initialize({
  onUnhandledRequest: 'bypass',
  waitUntilReady: false,
  serviceWorker: {
    url: `${basePath}mockServiceWorker.js`,
  },
});

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const loaders = [mswLoader];

export const decorators = [
  (Story) => (
    <IntlProvider messages={enMessages} locale="en" defaultLocale="en">
      <StaticRouter location="/">
        <Story />
      </StaticRouter>
    </IntlProvider>
  ),
];
