import React from 'react';
import { Container } from '@plone/components';
import type { Video as VideoContent } from '@simplesconsultoria/volto-videos/types/content';
import VideoPlayer from '@simplesconsultoria/volto-videos/components/VideoPlayer/VideoPlayer';

interface VideoViewProps {
  content: VideoContent;
}

const VideoView: React.FC<VideoViewProps> = ({ content }) => {
  const { title, description, text, videoUrl } = content;
  const previewImage = content.preview_image?.scales?.huge?.download;

  return (
    <Container id="page-document" className="view-wrapper video-view" narrow>
      <h1 className="documentFirstHeading">{title}</h1>
      {description && <p className="documentDescription">{description}</p>}
      <figure>
        <VideoPlayer url={videoUrl} title={title} previewImage={previewImage} />
      </figure>
      {text && (
        <Container className="body">
          <div dangerouslySetInnerHTML={{ __html: text?.data }} />
        </Container>
      )}
    </Container>
  );
};

export default VideoView;
