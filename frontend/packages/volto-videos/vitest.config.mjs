import { defineConfig } from 'vitest/config';
import voltoVitestConfig from '@plone/volto/vitest.config.mjs';
import path from 'path';

const addonAlias = {
  '@simplesconsultoria/volto-videos': path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    'src',
  ),
};

const projects = (voltoVitestConfig.test?.projects ?? []).map((project) => ({
  ...project,
  resolve: {
    ...project.resolve,
    alias: {
      ...(project.resolve?.alias ?? {}),
      ...addonAlias,
    },
  },
}));

export default defineConfig({
  ...voltoVitestConfig,
  resolve: {
    alias: {
      ...(voltoVitestConfig.resolve?.alias ?? {}),
      ...addonAlias,
    },
  },
  test: {
    ...voltoVitestConfig.test,
    projects,
  },
});
