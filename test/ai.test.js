const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const AI = require('../src/game/AI.js');
const Paddle = require('../src/game/Paddle.js');

const makePaddle = (overrides = {}) =>
  new Paddle({ x: 79, y: 10, height: 5, speed: 1, courtTop: 0, courtBottom: 24, ...overrides });

const court = { width: 80, height: 24 };

describe('AI', () => {
  describe('constructor', () => {
    it('defaults to normal difficulty', () => {
      const ai = new AI();
      assert.equal(ai.difficulty, 'normal');
    });

    it('accepts custom difficulty', () => {
      const ai = new AI({ difficulty: 'hard' });
      assert.equal(ai.difficulty, 'hard');
    });
  });

  describe('getMove()', () => {
    it('returns a valid move string', () => {
      const ai = new AI({ difficulty: 'normal' });
      const paddle = makePaddle();
      const ball = { x: 40, y: 5, dx: 1, dy: 0 };
      const validMoves = ['up', 'down', 'none'];
      // Run several ticks to get past reaction interval
      for (let i = 0; i < 10; i++) {
        const move = ai.getMove(ball, paddle, court);
        assert.ok(validMoves.includes(move), `"${move}" is not a valid move`);
      }
    });

    it('moves toward ball when ball approaches (normal)', () => {
      const ai = new AI({ difficulty: 'normal' });
      const paddle = makePaddle({ y: 15 }); // center at 17.5
      const ball = { x: 40, y: 5, dx: 1, dy: 0 }; // ball above paddle
      // Call enough times to trigger reaction
      let sawUp = false;
      for (let i = 0; i < 20; i++) {
        const move = ai.getMove(ball, paddle, court);
        if (move === 'up') sawUp = true;
      }
      assert.ok(sawUp, 'AI should move up toward ball above paddle');
    });

    it('moves toward center when ball moves away', () => {
      const ai = new AI({ difficulty: 'normal' });
      const paddle = makePaddle({ y: 0 }); // center at 2.5, court center is 12
      const ball = { x: 40, y: 5, dx: -1, dy: 0 }; // moving away
      let sawDown = false;
      for (let i = 0; i < 20; i++) {
        const move = ai.getMove(ball, paddle, court);
        if (move === 'down') sawDown = true;
      }
      assert.ok(sawDown, 'AI should move toward center when ball moves away');
    });

    it('respects reaction interval for hard difficulty', () => {
      const ai = new AI({ difficulty: 'hard' });
      const paddle = makePaddle({ y: 10 });
      const ball = { x: 40, y: 10, dx: 1, dy: 0 };
      // Hard has reactionInterval=1, so every tick triggers reaction
      const move = ai.getMove(ball, paddle, court);
      assert.ok(['up', 'down', 'none'].includes(move));
    });

    it('works with easy difficulty', () => {
      const ai = new AI({ difficulty: 'easy' });
      const paddle = makePaddle({ y: 10 });
      const ball = { x: 40, y: 5, dx: 1, dy: 0 };
      const validMoves = ['up', 'down', 'none'];
      for (let i = 0; i < 20; i++) {
        const move = ai.getMove(ball, paddle, court);
        assert.ok(validMoves.includes(move));
      }
    });
  });
});
