import type { IntlShape } from 'react-intl';

interface SchemaEnhancerProps {
  schema: any;
  formData?: any;
  intl?: IntlShape;
}

export const videoSchemaEnhancer = ({ schema }: SchemaEnhancerProps) => {
  schema.properties.align.default = 'wide';
  schema.properties.align.actions = ['left', 'right', 'center', 'wide', 'full'];
  return schema;
};
