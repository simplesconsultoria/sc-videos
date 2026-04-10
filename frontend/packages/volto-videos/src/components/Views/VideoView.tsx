import React from 'react';
import { Container } from '@plone/components';
import type { Video as VideoContent } from '@simplesconsultoria/volto-videos/types/content';
import Video from '@plone/volto/components/manage/Blocks/Video/Body';

interface VideoViewProps {
  content: VideoContent;
}

const VideoView: React.FC<VideoViewProps> = ({ content }) => {
  const { title, description, text, remoteUrl } = content;
  const image_scales = content.preview_image_link?.image_scales;
  if (image_scales) {
    image_scales.image[0].base_path = content.preview_image_link['@id'];
  }

  return (
    <Container id="page-document" className={`view-wrapper video-view`} narrow>
      <h1 className="documentFirstHeading">{title}</h1>
      <p className="documentDescription">{description}</p>
      <figure>
        <Video
          data={{
            ...content,
            url: remoteUrl,
            image_scales,
          }}
          image_field="image"
        />
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
