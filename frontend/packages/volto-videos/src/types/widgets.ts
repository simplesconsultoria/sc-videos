export interface VideoMetadata {
  service: string;
  video_id: string;
  title: string;
  text: string;
  duration: number;
  thumbnail_url: string;
  channel: string;
  subjects: string[];
}

export interface VideoURLWidgetProps {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  error?: string[];
  value?: string;
  formData?: Record<string, unknown>;
  onChange: (id: string, value: unknown) => void;
  onBlur: (id: string, value: string | undefined) => void;
  onClick: () => void;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  isDisabled?: boolean;
}
