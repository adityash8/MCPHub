import { formatDate } from '../lib/utils';

describe('formatDate', () => {
  test('formats dates correctly', () => {
    // Fix "now" to a specific date so tests are deterministic
    // Using 2024-05-10 12:00:00Z as our "current" time
    jest.useFakeTimers().setSystemTime(new Date('2024-05-10T12:00:00Z'));

    // Today: Diff is 0 days
    expect(formatDate('2024-05-10T08:00:00Z')).toBe('Today');

    // Yesterday: Diff is 1 day
    expect(formatDate('2024-05-09T12:00:00Z')).toBe('Yesterday');

    // Days ago: Diff is < 7 days
    expect(formatDate('2024-05-05T12:00:00Z')).toBe('5 days ago');

    // Weeks ago: Diff is < 30 days
    expect(formatDate('2024-04-26T12:00:00Z')).toBe('2 weeks ago');

    // Months ago: Diff is < 365 days
    expect(formatDate('2024-03-10T12:00:00Z')).toBe('2 months ago');
    expect(formatDate('2023-05-13T12:00:00Z')).toBe('12 months ago'); // 363 days ago -> Math.floor(363/30) = 12

    // Years ago: Diff is >= 365 days
    expect(formatDate('2023-05-10T12:00:00Z')).toBe('1 years ago');
    expect(formatDate('2022-05-10T12:00:00Z')).toBe('2 years ago');

    jest.useRealTimers();
  });
});
