/**
 * Format a duration in seconds to a human-readable string.
 *
 * Returns "HH:MM:SS" when hours > 0, otherwise "MM:SS".
 * Returns an empty string for zero or falsy values.
 */
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds) return '';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
