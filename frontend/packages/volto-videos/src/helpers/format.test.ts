import { describe, it, expect } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('returns empty string for 0', () => {
    expect(formatDuration(0)).toBe('');
  });

  it('formats seconds only', () => {
    expect(formatDuration(5)).toBe('00:05');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(90)).toBe('01:30');
  });

  it('formats exact minutes', () => {
    expect(formatDuration(600)).toBe('10:00');
  });

  it('formats hours, minutes, and seconds', () => {
    expect(formatDuration(3723)).toBe('01:02:03');
  });

  it('formats exact hours', () => {
    expect(formatDuration(7200)).toBe('02:00:00');
  });

  it('formats just over an hour', () => {
    expect(formatDuration(3601)).toBe('01:00:01');
  });

  it('pads single digits', () => {
    expect(formatDuration(61)).toBe('01:01');
  });

  it('handles large values', () => {
    expect(formatDuration(86399)).toBe('23:59:59');
  });
});
