const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Sound = require('../src/game/Sound.js');

describe('Sound', () => {
  describe('constructor', () => {
    it('defaults to enabled', () => {
      const s = new Sound();
      assert.equal(s.enabled, true);
    });

    it('respects enabled=false', () => {
      const s = new Sound({ enabled: false });
      assert.equal(s.enabled, false);
    });
  });

  describe('methods do not throw when enabled', () => {
    const s = new Sound({ enabled: false }); // disable to avoid actual beeps

    it('paddleHit()', () => {
      assert.doesNotThrow(() => s.paddleHit());
    });

    it('wallBounce()', () => {
      assert.doesNotThrow(() => s.wallBounce());
    });

    it('score()', () => {
      assert.doesNotThrow(() => s.score());
    });

    it('gameOver()', () => {
      assert.doesNotThrow(() => s.gameOver());
    });
  });

  describe('methods do not throw when disabled', () => {
    const s = new Sound({ enabled: false });

    it('paddleHit()', () => {
      assert.doesNotThrow(() => s.paddleHit());
    });

    it('wallBounce()', () => {
      assert.doesNotThrow(() => s.wallBounce());
    });

    it('score()', () => {
      assert.doesNotThrow(() => s.score());
    });

    it('gameOver()', () => {
      assert.doesNotThrow(() => s.gameOver());
    });
  });

  describe('enable() / disable()', () => {
    it('enable() sets enabled to true', () => {
      const s = new Sound({ enabled: false });
      s.enable();
      assert.equal(s.enabled, true);
    });

    it('disable() sets enabled to false', () => {
      const s = new Sound({ enabled: true });
      s.disable();
      assert.equal(s.enabled, false);
    });
  });
});
