import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import { formatDate } from '../lib/utils.ts';

describe('formatDate', () => {
  test('formats dates correctly', () => {
    // Fix "now" to a specific date so tests are deterministic
    // Using 2024-05-10 12:00:00Z as our "current" time
    mock.timers.enable({ now: new Date('2024-05-10T12:00:00Z').getTime() });

    // Today: Diff is 0 days
    assert.strictEqual(formatDate('2024-05-10T08:00:00Z'), 'Today');

    // Yesterday: Diff is 1 day
    assert.strictEqual(formatDate('2024-05-09T12:00:00Z'), 'Yesterday');

    // Days ago: Diff is < 7 days
    assert.strictEqual(formatDate('2024-05-05T12:00:00Z'), '5 days ago');

    // Weeks ago: Diff is < 30 days
    assert.strictEqual(formatDate('2024-04-26T12:00:00Z'), '2 weeks ago');

    // Months ago: Diff is < 365 days
    assert.strictEqual(formatDate('2024-03-10T12:00:00Z'), '2 months ago');
    assert.strictEqual(formatDate('2023-05-13T12:00:00Z'), '12 months ago'); // 363 days ago -> Math.floor(363/30) = 12

    // Years ago: Diff is >= 365 days
    assert.strictEqual(formatDate('2023-05-10T12:00:00Z'), '1 years ago');
    assert.strictEqual(formatDate('2022-05-10T12:00:00Z'), '2 years ago');

    mock.timers.reset();
  });
});
