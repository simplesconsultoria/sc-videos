/**
 * VideoURLWidget component (edit).
 *
 * A widget for editing video URLs. The user enters a URL and clicks
 * the submit button to validate it and fetch metadata from the
 * @@video-metadata service.
 */
import React, { useState, useCallback, useEffect } from 'react';
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
import {
  fetchVideoMetadata,
  isVideoMetadataPopulated,
} from '@simplesconsultoria/volto-videos/helpers/videoMetadata';
import { applyVideoMetadataToForm } from '@simplesconsultoria/volto-videos/helpers/applyMetadata';
import MetadataPreview from '@simplesconsultoria/volto-videos/components/Sidebar/MetadataPreview';

const FieldDescription: React.FC<{
  description?: string;
  metadata?: VideoMetadata;
  isLoading?: boolean;
}> = ({ description, metadata, isLoading = false }) => {
  return (
    <>
      {description}
      {metadata && !isLoading && <MetadataPreview metadata={metadata} />}
    </>
  );
};

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

  // Re-sync local state when `props.value` changes externally — e.g. when
  // the same field is rendered by a second VideoURLWidget instance (the
  // in-block EditForm and the content-type sidebar both bind to videoUrl).
  // While the user is typing in *this* instance, onChangeValue has already
  // pushed the new value to the parent, so props.value matches and the
  // functional setter is a no-op.
  useEffect(() => {
    const next = props.value ?? '';
    setValue((current) => (current === next ? current : next));
  }, [props.value]);

  const rawMetadata = props.formData?._metadata;
  const metadata = isVideoMetadataPopulated(rawMetadata)
    ? rawMetadata
    : undefined;

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
        applyVideoMetadataToForm({
          metadata: result.data,
          formData: props.formData,
          onChange,
        });
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
    <FormFieldWrapper
      {...props}
      description={
        <FieldDescription
          description={props.description}
          metadata={metadata}
          isLoading={isLoading}
        />
      }
      className="video-url wide"
    >
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
              <Icon name={clearSVG} size="18px" />
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
              <Icon name={clearSVG} size="18px" />
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
    </FormFieldWrapper>
  );
};

export default VideoURLWidget;
