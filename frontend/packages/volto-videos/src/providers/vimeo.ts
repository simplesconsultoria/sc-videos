import type { VideoProvider } from '@simplesconsultoria/volto-videos/types/videoPlayer';

const vimeoProvider: VideoProvider = {
  id: 'vimeo',
  name: 'Vimeo',
  urlPattern: /(?:vimeo\.com|player\.vimeo\.com\/video)\/(\d+)/,

  getDefaultThumbnail(videoId: string): string {
    return `https://vumbnail.com/${videoId}.jpg`;
  },

  getEmbedUrl(videoId: string, autoplay: boolean): string {
    const ap = autoplay ? 1 : 0;
    return [
      `https://player.vimeo.com/video/${videoId}`,
      '?api=false',
      `&autoplay=${ap}`,
      `&muted=${ap}`,
      '&byline=false',
      '&portrait=false',
      '&title=false',
    ].join('');
  },
};

export default vimeoProvider;
