const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Physics = require('../src/game/Physics.js');
const Ball = require('../src/game/Ball.js');
const Paddle = require('../src/game/Paddle.js');

const makeBall = (overrides = {}) => {
  const ball = new Ball({ x: 40, y: 12, speed: 1, maxSpeed: 3 });
  Object.assign(ball, overrides);
  return ball;
};

const makePaddle = (overrides = {}) =>
  new Paddle({ x: 0, y: 10, height: 5, speed: 1, courtTop: 0, courtBottom: 24, ...overrides });

describe('Physics', () => {
  describe('checkPaddleCollision()', () => {
    it('detects collision with left paddle', () => {
      const paddle = makePaddle({ x: 0, y: 10, height: 5 });
      const ball = makeBall({ x: 0, y: 12, dx: -1, dy: 0 });
      const result = Physics.checkPaddleCollision(ball, paddle);
      assert.ok(result !== null);
      assert.ok(typeof result.hitRatio === 'number');
    });

    it('detects collision with right paddle', () => {
      const paddle = makePaddle({ x: 79, y: 10, height: 5 });
      const ball = makeBall({ x: 79, y: 12, dx: 1, dy: 0 });
      const result = Physics.checkPaddleCollision(ball, paddle);
      assert.ok(result !== null);
    });

    it('returns null when ball misses paddle vertically', () => {
      const paddle = makePaddle({ x: 0, y: 10, height: 5 });
      const ball = makeBall({ x: 0, y: 5, dx: -1, dy: 0 });
      assert.equal(Physics.checkPaddleCollision(ball, paddle), null);
    });

    it('returns null when ball has not reached the paddle', () => {
      const paddle = makePaddle({ x: 0, y: 10, height: 5 });
      // Ball is to the right of left paddle, moving left but hasn't reached it
      const ball = makeBall({ x: 5, y: 12, dx: -1, dy: 0 });
      assert.equal(Physics.checkPaddleCollision(ball, paddle), null);
    });

    it('returns null when dx is zero', () => {
      const paddle = makePaddle({ x: 0, y: 10, height: 5 });
      const ball = makeBall({ x: 0, y: 12, dx: 0, dy: 1 });
      assert.equal(Physics.checkPaddleCollision(ball, paddle), null);
    });

    it('returns hitRatio of 0 when ball hits center of paddle', () => {
      const paddle = makePaddle({ x: 0, y: 10, height: 5 }); // center at 12
      const ball = makeBall({ x: 0, y: 12, dx: -1, dy: 0 });
      const result = Physics.checkPaddleCollision(ball, paddle);
      assert.equal(result.hitRatio, 0);
    });

    it('returns hitRatio clamped to [-1, 1]', () => {
      const paddle = makePaddle({ x: 0, y: 10, height: 5 });
      const ball = makeBall({ x: 0, y: 14, dx: -1, dy: 0 }); // bottom edge
      const result = Physics.checkPaddleCollision(ball, paddle);
      assert.ok(result.hitRatio >= -1 && result.hitRatio <= 1);
    });
  });

  describe('checkWallCollision()', () => {
    it('returns "top" when ball is at top boundary', () => {
      const ball = makeBall({ y: 0 });
      assert.equal(Physics.checkWallCollision(ball, 0, 24), 'top');
    });

    it('returns "bottom" when ball is at bottom boundary', () => {
      const ball = makeBall({ y: 24 });
      assert.equal(Physics.checkWallCollision(ball, 0, 24), 'bottom');
    });

    it('returns null when ball is in play', () => {
      const ball = makeBall({ y: 12 });
      assert.equal(Physics.checkWallCollision(ball, 0, 24), null);
    });
  });

  describe('checkScore()', () => {
    it('returns 2 when ball passes left boundary', () => {
      const ball = makeBall({ x: 0 });
      assert.equal(Physics.checkScore(ball, 0, 79), 2);
    });

    it('returns 1 when ball passes right boundary', () => {
      const ball = makeBall({ x: 79 });
      assert.equal(Physics.checkScore(ball, 0, 79), 1);
    });

    it('returns 0 when ball is in play', () => {
      const ball = makeBall({ x: 40 });
      assert.equal(Physics.checkScore(ball, 0, 79), 0);
    });
  });

  describe('applyPaddleBounce()', () => {
    it('reverses ball direction for left paddle (direction = 1)', () => {
      const ball = makeBall({ dx: -1, dy: 0.5 });
      ball.speed = 1;
      Physics.applyPaddleBounce(ball, 0, 1);
      assert.ok(ball.dx > 0);
    });

    it('reverses ball direction for right paddle (direction = -1)', () => {
      const ball = makeBall({ dx: 1, dy: 0.5 });
      ball.speed = 1;
      Physics.applyPaddleBounce(ball, 0, -1);
      assert.ok(ball.dx < 0);
    });

    it('increases ball speed after bounce', () => {
      const ball = makeBall({ dx: 1, dy: 0 });
      ball.speed = 1;
      const prevSpeed = ball.speed;
      Physics.applyPaddleBounce(ball, 0.5, -1);
      assert.ok(ball.speed > prevSpeed);
    });

    it('applies aspect-ratio-corrected dy from hit ratio', () => {
      const ball = makeBall({ dx: 1, dy: 0 });
      ball.speed = 1;
      Physics.applyPaddleBounce(ball, 0.5, 1);
      // dy should be smaller than dx due to CELL_ASPECT correction
      assert.ok(Math.abs(ball.dy) < Math.abs(ball.dx));
      assert.ok(ball.dy !== 0, 'dy should be non-zero for non-center hit');
    });

    it('gives near-zero dy for center hits', () => {
      const ball = makeBall({ dx: 1, dy: 0.5 });
      ball.speed = 1;
      Physics.applyPaddleBounce(ball, 0, 1);
      assert.ok(Math.abs(ball.dy) < 0.01);
    });
  });

  describe('applyWallBounce()', () => {
    it('forces positive dy when hitting top wall', () => {
      const ball = makeBall({ y: 0, dy: -1.5 });
      Physics.applyWallBounce(ball, 0, 24);
      assert.ok(ball.dy > 0);
      assert.ok(ball.y > 0, 'ball should be clamped past boundary');
    });

    it('forces negative dy when hitting bottom wall', () => {
      const ball = makeBall({ y: 24, dy: 1.5 });
      Physics.applyWallBounce(ball, 0, 24);
      assert.ok(ball.dy < 0);
      assert.ok(ball.y < 24, 'ball should be clamped past boundary');
    });

    it('preserves dy magnitude', () => {
      const ball = makeBall({ y: 0, dy: -0.7 });
      Physics.applyWallBounce(ball, 0, 24);
      assert.ok(Math.abs(ball.dy - 0.7) < 0.001);
    });
  });
});
