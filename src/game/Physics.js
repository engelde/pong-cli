// Terminal cells are ~2× taller than wide
const CELL_ASPECT = 2.0;

// Maximum deflection angle off a paddle (60 degrees)
const MAX_BOUNCE_ANGLE = Math.PI / 3;

const Physics = {
  checkPaddleCollision(ball, paddle) {
    const bounds = paddle.getBounds();
    const prevX = ball.x - ball.dx;

    if (ball.dx < 0) {
      // Moving left: ball must have crossed paddle from right to left this frame
      if (!(prevX >= bounds.right && ball.x <= bounds.right)) return null;
    } else if (ball.dx > 0) {
      // Moving right: ball must have crossed paddle from left to right this frame
      if (!(prevX <= bounds.left && ball.x >= bounds.left)) return null;
    } else {
      return null;
    }

    // Small grace zone so near-misses still count
    if (ball.y < bounds.top - 0.5 || ball.y > bounds.bottom + 0.5) return null;

    const paddleCenter = (bounds.top + bounds.bottom) / 2;
    const paddleHalfHeight = (bounds.bottom - bounds.top) / 2 + 0.5;
    const hitRatio = paddleHalfHeight === 0 ? 0 : (ball.y - paddleCenter) / paddleHalfHeight;

    return { hitRatio: Math.max(-1, Math.min(1, hitRatio)) };
  },

  applyPaddleBounce(ball, hitRatio, direction) {
    // Compute bounce angle from where ball hit the paddle
    const angle = hitRatio * MAX_BOUNCE_ANGLE;
    ball.dx = direction * ball.speed * Math.cos(angle);
    ball.dy = (ball.speed * Math.sin(angle)) / CELL_ASPECT;
    ball.increaseSpeed();
  },

  checkWallCollision(ball, courtTop, courtBottom) {
    if (ball.y <= courtTop) return 'top';
    if (ball.y >= courtBottom) return 'bottom';
    return null;
  },

  applyWallBounce(ball, courtTop, courtBottom) {
    // Clamp position AND force correct direction to prevent oscillation
    if (ball.y <= courtTop) {
      ball.y = courtTop + 0.1;
      ball.dy = Math.abs(ball.dy);
    } else if (ball.y >= courtBottom) {
      ball.y = courtBottom - 0.1;
      ball.dy = -Math.abs(ball.dy);
    }
  },

  checkScore(ball, courtLeft, courtRight) {
    if (ball.x <= courtLeft) return 2;
    if (ball.x >= courtRight) return 1;
    return 0;
  },
};

module.exports = Physics;
