/**
 * EditForm — in-block placeholder shown when the parent Video has no
 * `videoUrl` yet.
 *
 * Embeds the same `VideoURLWidget` used by the Video content type's edit
 * sidebar, so the editor can paste a URL and fetch metadata directly from
 * the block area without opening the sidebar. Updates flow to the parent
 * content via Volto's `onChangeField` — `properties` is forwarded to the
 * widget as `formData`, which keeps sibling-field population (title,
 * description, duration, …) and the `_metadata` preview working exactly
 * as they do in the sidebar.
 *
 * @see VideoURLWidget for the underlying input + metadata fetcher.
 * @see VideoPlayerBlock/Edit for how this is gated on `properties.videoUrl`.
 */
import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import VideoURLWidget from '@simplesconsultoria/volto-videos/components/Widgets/VideoURLWidget';
import type { VideoURLWidgetProps } from '@simplesconsultoria/volto-videos/types/widgets';

export type EditFormProps = {
  /** Field on the parent content to read/write. Defaults to `videoUrl`. */
  fieldId?: string;
  /** Localized title rendered above the widget. */
  formHeader?: string;
  /** Volto-style icon (SVG module) shown next to the title. */
  formIcon?: string;
  /** Color applied to the icon. Defaults to blue. */
  formIconColor?: string;
  /** Placeholder forwarded to the widget input. */
  placeholder?: string;
  /** Parent content properties — forwarded to the widget as `formData`. */
  properties: Record<string, unknown>;
  /** Volto `BlockEditProps.onChangeField` — updates a single content field. */
  onChangeField: (id: string, value: unknown) => void;
};

const noop = () => {};

const EditForm: React.FC<EditFormProps> = ({
  fieldId = 'videoUrl',
  formHeader,
  formIcon,
  formIconColor = 'var(--theme-foreground-color)',
  placeholder,
  properties,
  onChangeField,
}) => {
  const value = (properties[fieldId] as string | undefined) ?? '';

  // `columns: 1` drops FormFieldWrapper's label column so the widget renders
  // edge-to-edge inside the block; the icon + title above already provide the
  // affordance the label would have given.
  const widgetProps = {
    id: fieldId,
    title: '',
    value,
    formData: properties,
    onChange: onChangeField,
    onBlur: onChangeField,
    onClick: noop,
    placeholder,
    columns: 1,
  } as unknown as VideoURLWidgetProps;

  return (
    <div className="video-edit-form" role="group" aria-label={formHeader}>
      <div className="formHeader">
        {formIcon ? (
          <Icon
            name={formIcon}
            className="blockIcon formIcon"
            size="50px"
            color={formIconColor}
          />
        ) : null}
        {formHeader ? <h3 className="formTitle">{formHeader}</h3> : null}
      </div>
      <div className="formWidget">
        <VideoURLWidget {...widgetProps} />
      </div>
    </div>
  );
};

export default EditForm;
