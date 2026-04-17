import type { VideoProvider } from '@simplesconsultoria/volto-videos/types/videoPlayer';

const youtubeProvider: VideoProvider = {
  id: 'youtube',
  name: 'YouTube',
  urlPattern:
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/,

  getDefaultThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  },

  getEmbedUrl(videoId: string, autoplay: boolean): string {
    const ap = autoplay ? 1 : 0;
    return [
      `https://www.youtube.com/embed/${videoId}`,
      '?autohide=true',
      `&autoplay=${ap}`,
      `&mute=${ap}`,
      '&modestbranding=1',
      '&rel=0',
    ].join('');
  },
};

export default youtubeProvider;
