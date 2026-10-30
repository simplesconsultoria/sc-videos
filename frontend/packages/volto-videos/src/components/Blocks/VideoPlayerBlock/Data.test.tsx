import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import VideoPlayerBlockDataForm from './Data';

vi.mock('@plone/volto/components/manage/Form', () => ({
  BlockDataForm: (props: {
    onChangeField: (id: string, value: any) => void;
  }) => {
    // Expose the handler and every prop so the tests can invoke and inspect them.
    (globalThis as any).__lastOnChangeField = props.onChangeField;
    (globalThis as any).__lastFormProps = props;
    return null;
  },
}));

vi.mock('react-intl', () => ({
  defineMessages: (messages: Record<string, unknown>) => messages,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) =>
      defaultMessage,
  }),
}));

describe('VideoPlayerBlockDataForm.handleFieldChange', () => {
  it('stores the changed field next to the existing data', () => {
    const onChangeBlock = vi.fn();
    render(
      <VideoPlayerBlockDataForm
        data={{ align: 'center', autoPlay: false }}
        block="b"
        onChangeBlock={onChangeBlock}
      />,
    );
    const onChangeField = (globalThis as any).__lastOnChangeField;
    onChangeField('size', 'm');
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch).toEqual({ align: 'center', autoPlay: false, size: 'm' });
  });
});

describe('VideoPlayerBlockDataForm props reaching BlockDataForm', () => {
  it('forwards the block, its data and onChangeBlock', () => {
    const onChangeBlock = vi.fn();
    const data = { '@type': 'playerBlock', align: 'center' };
    render(
      <VideoPlayerBlockDataForm
        data={data}
        block="block-1"
        onChangeBlock={onChangeBlock}
        blocksConfig={{}}
      />,
    );
    const props = (globalThis as any).__lastFormProps;
    expect(props.block).toBe('block-1');
    expect(props.formData).toBe(data);
    expect(props.onChangeBlock).toBe(onChangeBlock);
  });

  it('forwards navRoot, contentType and the block errors', () => {
    const blocksErrors = { align: 'Required' };
    render(
      <VideoPlayerBlockDataForm
        data={{ '@type': 'playerBlock', align: 'center' }}
        block="b"
        onChangeBlock={vi.fn()}
        blocksConfig={{}}
        navRoot="/en"
        contentType="Video"
        blocksErrors={blocksErrors}
      />,
    );
    const props = (globalThis as any).__lastFormProps;
    expect(props.navRoot).toBe('/en');
    expect(props.contentType).toBe('Video');
    expect(props.errors).toBe(blocksErrors);
  });

  it('reads the schema from the block configuration', () => {
    render(
      <VideoPlayerBlockDataForm
        data={{ '@type': 'playerBlock', align: 'center' }}
        block="b"
        onChangeBlock={vi.fn()}
        blocksConfig={{
          playerBlock: {
            blockSchema: () => ({ title: 'Configured', properties: {} }),
          },
        }}
      />,
    );
    const props = (globalThis as any).__lastFormProps;
    expect(props.schema.title).toBe('Configured');
    expect(props.title).toBe('Configured');
  });

  it('falls back to the block schema when the configuration has none', () => {
    render(
      <VideoPlayerBlockDataForm
        data={{ '@type': 'playerBlock', align: 'center' }}
        block="b"
        onChangeBlock={vi.fn()}
        blocksConfig={{}}
      />,
    );
    const props = (globalThis as any).__lastFormProps;
    expect(Object.keys(props.schema.properties)).toEqual(
      expect.arrayContaining(['autoPlay', 'size', 'align']),
    );
  });
});
