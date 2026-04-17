import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'SC Videos — Storybook',
  brandUrl: 'https://simplesconsultoria.github.io/sc-videos/',
  brandImage: 'storybook-logo.svg',
  brandTarget: '_self',

  // Brand colors
  colorPrimary: '#f48222',
  colorSecondary: '#f48222',
});

addons.setConfig({ theme });
