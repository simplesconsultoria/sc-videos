export type VideoSource = 'youtube' | 'vimeo';

export interface VideoInfo {
  source: VideoSource;
  videoId: string;
}

export interface VideoPlayerProps {
  url: string;
  title?: string;
  previewImage?: string | null;
  autoplay?: boolean;
  aspectRatio?: string;
  className?: string;
}
