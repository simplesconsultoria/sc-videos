// Ambient declarations for `@kitconcept/volto-light-theme` subpath imports.
//
// This add-on deliberately does NOT depend on `@kitconcept/volto-light-theme`:
// the theme is supplied by the consuming project, which registers it as a Volto
// add-on. Declaring it as a dependency (or peer dependency) would make pnpm
// install it for real and force the theme on every consumer.
//
// The imports below therefore resolve at build time through Volto's add-on
// registry, but TypeScript cannot see them. Declaring the modules here — rather
// than adding a `paths` entry to `tsconfig.json` — keeps the TS config free of
// workspace-only paths, which `@plone/registry` would otherwise promote into
// webpack aliases inside consumers (see kitconcept.intranet#601).

declare module '@kitconcept/volto-light-theme/components/Blocks/schema' {
  import type { JSONSchema, SchemaEnhancerArgs } from '@plone/types';

  export const defaultStylingSchema: (args: SchemaEnhancerArgs) => JSONSchema;
}

declare module '@kitconcept/volto-light-theme/components/Caption/Caption' {
  import type * as React from 'react';

  type CaptionProps = {
    as?: keyof React.JSX.IntrinsicElements;
    title?: string;
    description?: string;
    credit?: string;
  };

  const Caption: (props: CaptionProps) => React.JSX.Element;

  export default Caption;
}
