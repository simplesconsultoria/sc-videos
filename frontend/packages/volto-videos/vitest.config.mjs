import { defineConfig } from 'vitest/config';
import voltoVitestConfig from '@plone/volto/vitest.config.mjs';
import { createRequire } from 'module';
import path from 'path';

const packageDir = path.dirname(new URL(import.meta.url).pathname);
const requireFrom = createRequire(import.meta.url);

// This add-on does not depend on `@kitconcept/volto-light-theme`; the theme is
// provided by the consuming project. Resolve it through Node's algorithm rather
// than assuming a nested `node_modules`, which under pnpm only exists when the
// package is a direct dependency.
const voltoLightThemeSrc = path.join(
  path.dirname(
    requireFrom.resolve('@kitconcept/volto-light-theme/package.json'),
  ),
  'src',
);

const addonAlias = {
  '@simplesconsultoria/volto-videos': path.resolve(packageDir, 'src'),
  '@kitconcept/volto-light-theme': voltoLightThemeSrc,
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
