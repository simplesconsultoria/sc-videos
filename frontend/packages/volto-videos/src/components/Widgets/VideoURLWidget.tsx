/**
 * VideoURLWidget component (edit).
 *
 * A widget for editing video URLs. The user enters a URL and clicks
 * the submit button to validate it and fetch metadata from the
 * @@video-metadata service.
 */
import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Input, Button, Loader, Message } from 'semantic-ui-react';
import FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import config from '@plone/volto/registry';
import clearSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import type {
  VideoMetadata,
  VideoURLWidgetProps,
} from '@simplesconsultoria/volto-videos/types/widgets';
import { formatDuration } from '@simplesconsultoria/volto-videos/helpers/format';
import { fetchVideoMetadata } from '@simplesconsultoria/volto-videos/helpers/videoMetadata';

const VideoURLWidget: React.FC<VideoURLWidgetProps> = (props) => {
  const {
    id,
    onChange,
    onBlur,
    onClick,
    minLength,
    maxLength,
    placeholder,
    isDisabled,
  } = props;

  const inputId = `field-${id}`;
  const location = useLocation();
  const contextUrl = getBaseUrl(location.pathname);

  const [value, setValue] = useState<string>(props.value ?? '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const metadata = (props.formData?._metadata as VideoMetadata) ?? null;

  const handleFetchMetadata = useCallback(
    async (videoUrl: string) => {
      setIsLoading(true);
      setFetchError(null);
      onChange('_metadata', undefined);

      const { settings } = config;
      const result = await fetchVideoMetadata(videoUrl, {
        apiPath: settings.apiPath || '',
        legacyTraverse: !!settings.legacyTraverse,
        contextUrl,
      });

      setFetchError(result.error);
      setIsLoading(false);

      if (result.data) {
        const { formData } = props;
        onChange('_metadata', result.data);
        // Only populate empty fields — don't overwrite user edits
        if (!formData?.title && result.data.title) {
          onChange('title', result.data.title);
        }
        if (!formData?.text && result.data.text) {
          onChange('text', {
            'content-type': 'text/html',
            data: `<p>${result.data.text.replace(/\n/g, '<br/>')}</p>`,
          });
        }
        if (!formData?.duration && result.data.duration) {
          onChange('duration', result.data.duration);
        }
      }
    },
    [contextUrl, onChange, props],
  );

  const clear = () => {
    setValue('');
    setFetchError(null);
    onChange(id, undefined);
    onChange('_metadata', undefined);
  };

  const onChangeValue = (newValue: string) => {
    setValue(newValue);
    setFetchError(null);
    onChange('_metadata', undefined);
    onChange(id, newValue.length === 0 ? undefined : newValue);
  };

  return (
    <FormFieldWrapper {...props} className="video-url wide">
      <div className="wrapper">
        <Input
          id={inputId}
          name={id}
          type="url"
          value={value}
          disabled={isDisabled}
          placeholder={placeholder ?? 'https://www.youtube.com/watch?v=...'}
          onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
            onChangeValue(target.value)
          }
          onBlur={({ target }: React.FocusEvent<HTMLInputElement>) =>
            onBlur(id, target.value === '' ? undefined : target.value)
          }
          onClick={() => onClick()}
          minLength={minLength ?? undefined}
          maxLength={maxLength ?? undefined}
        />
        {value.length > 0 && !metadata && (
          <Button.Group>
            <Button
              type="button"
              basic
              className="cancel"
              aria-label="clearVideoUrl"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                clear();
              }}
            >
              <Icon name={clearSVG} size="18px" color="#e40166" />
            </Button>
            <Button
              type="button"
              basic
              primary
              disabled={value.length === 0 || isLoading}
              aria-label="fetchVideoMetadata"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleFetchMetadata(value);
              }}
            >
              <Icon name={aheadSVG} size="18px" />
            </Button>
          </Button.Group>
        )}
        {metadata && (
          <Button.Group>
            <Button
              type="button"
              basic
              className="cancel"
              aria-label="clearVideoUrl"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                clear();
              }}
            >
              <Icon name={clearSVG} size="18px" color="#e40166" />
            </Button>
          </Button.Group>
        )}
      </div>

      {isLoading && (
        <Loader active inline size="small" className="video-url-loader" />
      )}

      {fetchError && (
        <Message negative size="tiny">
          <p>{fetchError}</p>
        </Message>
      )}

      {metadata && !isLoading && (
        <div className="video-metadata-preview">
          {metadata.thumbnail_url && (
            <img
              src={metadata.thumbnail_url}
              alt={metadata.title}
              className="video-thumbnail"
              style={{ maxWidth: '320px', marginTop: '0.5em' }}
            />
          )}
          <div className="video-metadata-info" style={{ marginTop: '0.5em' }}>
            {metadata.title && (
              <strong className="video-title">{metadata.title}</strong>
            )}
            {metadata.channel && (
              <span className="video-channel"> — {metadata.channel}</span>
            )}
            {metadata.duration > 0 && (
              <span className="video-duration">
                {' '}
                ({formatDuration(metadata.duration)})
              </span>
            )}
          </div>
        </div>
      )}
    </FormFieldWrapper>
  );
};

export default VideoURLWidget;
