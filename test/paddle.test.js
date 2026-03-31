const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Paddle = require('../src/game/Paddle.js');

const makePaddle = (overrides = {}) =>
  new Paddle({ x: 0, y: 10, height: 5, speed: 1, courtTop: 0, courtBottom: 24, ...overrides });

describe('Paddle', () => {
  describe('moveUp()', () => {
    it('decreases y by speed', () => {
      const p = makePaddle({ y: 10 });
      p.moveUp();
      assert.equal(p.y, 9);
    });

    it('clamps y to courtTop', () => {
      const p = makePaddle({ y: 0, courtTop: 0 });
      p.moveUp();
      assert.equal(p.y, 0);
    });
  });

  describe('moveDown()', () => {
    it('increases y by speed', () => {
      const p = makePaddle({ y: 10 });
      p.moveDown();
      assert.equal(p.y, 11);
    });

    it('clamps so bottom edge does not exceed courtBottom', () => {
      // courtBottom=24, height=5 → max y = 24 - 5 + 1 = 20
      const p = makePaddle({ y: 20, courtBottom: 24, height: 5 });
      p.moveDown();
      assert.equal(p.y, 20);
    });
  });

  describe('getPosition()', () => {
    it('returns x, y, and height', () => {
      const p = makePaddle({ x: 3, y: 7, height: 6 });
      assert.deepEqual(p.getPosition(), { x: 3, y: 7, height: 6 });
    });
  });

  describe('getBounds()', () => {
    it('returns top, bottom, left, right', () => {
      const p = makePaddle({ x: 5, y: 10, height: 5 });
      assert.deepEqual(p.getBounds(), { top: 10, bottom: 14, left: 5, right: 5 });
    });
  });

  describe('getCenter()', () => {
    it('returns vertical center of paddle', () => {
      const p = makePaddle({ y: 10, height: 6 });
      assert.equal(p.getCenter(), 13); // 10 + 6/2
    });
  });

  describe('reset()', () => {
    it('sets y to given value', () => {
      const p = makePaddle({ y: 5 });
      p.reset(15);
      assert.equal(p.y, 15);
    });
  });

  describe('containsY()', () => {
    it('returns true when ballY is at top edge', () => {
      const p = makePaddle({ y: 10, height: 5 });
      assert.equal(p.containsY(10), true);
    });

    it('returns true when ballY is at bottom edge', () => {
      const p = makePaddle({ y: 10, height: 5 });
      assert.equal(p.containsY(14), true);
    });

    it('returns true when ballY is in middle', () => {
      const p = makePaddle({ y: 10, height: 5 });
      assert.equal(p.containsY(12), true);
    });

    it('returns false when ballY is above paddle', () => {
      const p = makePaddle({ y: 10, height: 5 });
      assert.equal(p.containsY(9), false);
    });

    it('returns false when ballY is below paddle', () => {
      const p = makePaddle({ y: 10, height: 5 });
      assert.equal(p.containsY(15), false);
    });
  });
});
