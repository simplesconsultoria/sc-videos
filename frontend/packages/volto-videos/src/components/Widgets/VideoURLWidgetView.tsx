/**
 * VideoURLWidget view component.
 *
 * Read-only display of a video URL, rendered as a link.
 */
import React from 'react';
import cx from 'classnames';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

interface VideoURLWidgetViewProps {
  value?: string;
  children?: (value: string) => React.ReactNode;
  className?: string;
}

const VideoURLWidgetView: React.FC<VideoURLWidgetViewProps> = ({
  value,
  children,
  className,
}) =>
  value ? (
    <UniversalLink
      href={value}
      className={cx(className, 'video-url', 'widget')}
    >
      {children ? children(value) : value}
    </UniversalLink>
  ) : (
    <></>
  );

export default VideoURLWidgetView;
