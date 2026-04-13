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
    <div id="page-document" className="view-wrapper video-view">
      <Container className="contentHeader">
        <h1 className="documentFirstHeading">{title}</h1>
        {description && <p className="documentDescription">{description}</p>}
      </Container>
      <Container className="contentPlayer">
        <figure>
          <VideoPlayer
            url={videoUrl}
            title={title}
            previewImage={previewImage}
          />
        </figure>
      </Container>
      {text && (
        <Container className="contentBody">
          <div dangerouslySetInnerHTML={{ __html: text?.data }} />
        </Container>
      )}
    </div>
  );
};

export default VideoView;
