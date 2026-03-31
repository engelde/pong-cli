const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Ball = require('../src/game/Ball.js');

describe('Ball', () => {
  describe('constructor', () => {
    it('uses provided values', () => {
      const ball = new Ball({ x: 10, y: 5, speed: 1, maxSpeed: 3, courtWidth: 100, courtHeight: 50 });
      assert.equal(ball.x, 10);
      assert.equal(ball.y, 5);
      assert.equal(ball.speed, 1);
      assert.equal(ball.maxSpeed, 3);
      assert.equal(ball.courtWidth, 100);
      assert.equal(ball.courtHeight, 50);
    });

    it('applies defaults when no arguments given', () => {
      const ball = new Ball();
      assert.equal(ball.x, 0);
      assert.equal(ball.y, 0);
      assert.equal(ball.speed, 0.8);
      assert.equal(ball.maxSpeed, 2.0);
      assert.equal(ball.courtWidth, 80);
      assert.equal(ball.courtHeight, 24);
      assert.equal(ball.dx, 0);
      assert.equal(ball.dy, 0);
    });
  });

  describe('update()', () => {
    it('moves ball by dx and dy', () => {
      const ball = new Ball({ x: 10, y: 10 });
      ball.dx = 2;
      ball.dy = -1;
      ball.update();
      assert.equal(ball.x, 12);
      assert.equal(ball.y, 9);
    });

    it('stays in place when velocity is zero', () => {
      const ball = new Ball({ x: 5, y: 5 });
      ball.update();
      assert.equal(ball.x, 5);
      assert.equal(ball.y, 5);
    });

    it('handles negative positions', () => {
      const ball = new Ball({ x: 0, y: 0 });
      ball.dx = -1;
      ball.dy = -1;
      ball.update();
      assert.equal(ball.x, -1);
      assert.equal(ball.y, -1);
    });
  });

  describe('reset()', () => {
    it('centers ball on the court', () => {
      const ball = new Ball({ courtWidth: 80, courtHeight: 24 });
      ball.x = 0;
      ball.y = 0;
      ball.reset(1);
      assert.equal(ball.x, 40);
      assert.equal(ball.y, 12);
    });

    it('resets speed to baseSpeed', () => {
      const ball = new Ball({ speed: 0.8 });
      ball.speed = 2.0;
      ball.reset(1);
      assert.equal(ball.speed, 0.8);
    });

    it('sets dx in the given direction (positive)', () => {
      const ball = new Ball();
      ball.reset(1);
      assert.ok(ball.dx > 0, 'dx should be positive for direction 1');
    });

    it('sets dx in the given direction (negative)', () => {
      const ball = new Ball();
      ball.reset(-1);
      assert.ok(ball.dx < 0, 'dx should be negative for direction -1');
    });

    it('defaults direction to 1', () => {
      const ball = new Ball();
      ball.reset();
      assert.ok(ball.dx > 0, 'dx should be positive for default direction');
    });
  });

  describe('getPosition()', () => {
    it('returns current x and y', () => {
      const ball = new Ball({ x: 7, y: 3 });
      assert.deepEqual(ball.getPosition(), { x: 7, y: 3 });
    });
  });

  describe('increaseSpeed()', () => {
    it('increases speed by 4%', () => {
      const ball = new Ball({ speed: 1.0, maxSpeed: 3.0 });
      ball.dx = 1.0;
      ball.dy = 0;
      ball.increaseSpeed();
      assert.ok(Math.abs(ball.speed - 1.04) < 0.001);
    });

    it('clamps speed to maxSpeed', () => {
      const ball = new Ball({ speed: 1.95, maxSpeed: 2.0 });
      ball.dx = 1.95;
      ball.dy = 0;
      ball.increaseSpeed();
      assert.ok(ball.speed <= 2.0);
    });

    it('scales dx and dy proportionally', () => {
      const ball = new Ball({ speed: 1.0, maxSpeed: 3.0 });
      ball.dx = 0.6;
      ball.dy = 0.8;
      const prevDx = ball.dx;
      const prevDy = ball.dy;
      ball.increaseSpeed();
      const scale = ball.speed / 1.0;
      assert.ok(Math.abs(ball.dx - prevDx * scale) < 0.001);
      assert.ok(Math.abs(ball.dy - prevDy * scale) < 0.001);
    });

    it('does not scale when previous speed is zero', () => {
      const ball = new Ball({ speed: 0 });
      ball.dx = 1;
      ball.dy = 1;
      ball.increaseSpeed();
      assert.equal(ball.dx, 1);
      assert.equal(ball.dy, 1);
    });
  });

  describe('getDirection()', () => {
    it('returns 1 when dx is positive', () => {
      const ball = new Ball();
      ball.dx = 0.5;
      assert.equal(ball.getDirection(), 1);
    });

    it('returns -1 when dx is negative', () => {
      const ball = new Ball();
      ball.dx = -0.5;
      assert.equal(ball.getDirection(), -1);
    });
  });

  describe('setVelocity()', () => {
    it('sets dx and dy', () => {
      const ball = new Ball();
      ball.setVelocity(3, -2);
      assert.equal(ball.dx, 3);
      assert.equal(ball.dy, -2);
    });
  });
});
