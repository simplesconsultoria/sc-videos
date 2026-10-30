import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import VideoBlockDataForm from './Data';

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

const hrefItem = {
  '@id': 'https://example.com/video',
  Title: 'The video title',
  Description: 'The video description',
  hasPreviewImage: false,
  image_scales: {},
  videoUrl: 'https://youtu.be/x',
};

describe('VideoBlockDataForm.handleFieldChange', () => {
  it('copies Title and Description from the picked item when caption is empty', () => {
    const onChangeBlock = vi.fn();
    render(
      <VideoBlockDataForm
        data={{ href: [], align: 'center' }}
        block="b"
        onChangeBlock={onChangeBlock}
      />,
    );
    const onChangeField = (globalThis as any).__lastOnChangeField;
    onChangeField('href', [hrefItem]);
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.title).toBe('The video title');
    expect(patch.description).toBe('The video description');
  });

  it('does not overwrite an existing caption title or description', () => {
    const onChangeBlock = vi.fn();
    render(
      <VideoBlockDataForm
        data={{
          href: [],
          align: 'center',
          title: 'Kept title',
          description: 'Kept description',
        }}
        block="b"
        onChangeBlock={onChangeBlock}
      />,
    );
    const onChangeField = (globalThis as any).__lastOnChangeField;
    onChangeField('href', [hrefItem]);
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.title).toBe('Kept title');
    expect(patch.description).toBe('Kept description');
  });

  it('does not touch caption fields when href is cleared', () => {
    const onChangeBlock = vi.fn();
    render(
      <VideoBlockDataForm
        data={{ href: [hrefItem] as any, align: 'center', title: 'keep' }}
        block="b"
        onChangeBlock={onChangeBlock}
      />,
    );
    const onChangeField = (globalThis as any).__lastOnChangeField;
    onChangeField('href', []);
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.href).toEqual([]);
    expect(patch.title).toBe('keep');
  });

  it('passes other fields through unchanged', () => {
    const onChangeBlock = vi.fn();
    render(
      <VideoBlockDataForm
        data={{ href: [], align: 'center' }}
        block="b"
        onChangeBlock={onChangeBlock}
      />,
    );
    const onChangeField = (globalThis as any).__lastOnChangeField;
    onChangeField('size', 'm');
    const [, patch] = onChangeBlock.mock.calls[0];
    expect(patch.size).toBe('m');
    expect(patch).not.toHaveProperty('title');
  });
});

describe('VideoBlockDataForm props reaching BlockDataForm', () => {
  it('forwards the block, its data and onChangeBlock', () => {
    const onChangeBlock = vi.fn();
    const data = { '@type': 'video', href: [], align: 'center' };
    render(
      <VideoBlockDataForm
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
    const blocksErrors = { href: 'Required' };
    render(
      <VideoBlockDataForm
        data={{ '@type': 'video', href: [], align: 'center' }}
        block="b"
        onChangeBlock={vi.fn()}
        blocksConfig={{}}
        navRoot="/en"
        contentType="Document"
        blocksErrors={blocksErrors}
      />,
    );
    const props = (globalThis as any).__lastFormProps;
    expect(props.navRoot).toBe('/en');
    expect(props.contentType).toBe('Document');
    expect(props.errors).toBe(blocksErrors);
  });

  it('reads the schema from the block configuration', () => {
    render(
      <VideoBlockDataForm
        data={{ '@type': 'video', href: [], align: 'center' }}
        block="b"
        onChangeBlock={vi.fn()}
        blocksConfig={{
          video: {
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
      <VideoBlockDataForm
        data={{ '@type': 'video', href: [], align: 'center' }}
        block="b"
        onChangeBlock={vi.fn()}
        blocksConfig={{}}
      />,
    );
    const props = (globalThis as any).__lastFormProps;
    expect(Object.keys(props.schema.properties)).toEqual(
      expect.arrayContaining(['href', 'autoPlay', 'size', 'align']),
    );
  });
});
