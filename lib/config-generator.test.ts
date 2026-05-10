import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getConfigFileName } from './config-generator';
import type { Platform } from './types';

describe('getConfigFileName', () => {
  it('should return the correct filename for claude-desktop', () => {
    assert.strictEqual(
      getConfigFileName('claude-desktop' as Platform),
      'claude_desktop_config.json'
    );
  });

  it('should return the correct filename for cursor', () => {
    assert.strictEqual(
      getConfigFileName('cursor' as Platform),
      'cursor_mcp_config.json'
    );
  });

  it('should return the correct filename for continue', () => {
    assert.strictEqual(
      getConfigFileName('continue' as Platform),
      'continue_config.json'
    );
  });

  it('should return the correct filename for cline', () => {
    assert.strictEqual(
      getConfigFileName('cline' as Platform),
      'cline_config.json'
    );
  });

  it('should return the default filename for an unknown platform', () => {
    // We cast a string to Platform to test the fallback mechanism
    assert.strictEqual(
      getConfigFileName('unknown-platform' as Platform),
      'mcp_config.json'
    );
  });
});
