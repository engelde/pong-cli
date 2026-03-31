const DIFFICULTY_SETTINGS = {
  easy: {
    reactionInterval: 4,
    errorRange: 3,
    idleChance: 0.3,
  },
  normal: {
    reactionInterval: 2,
    errorRange: 1.5,
    idleChance: 0,
  },
  hard: {
    reactionInterval: 1,
    errorRange: 0.5,
    idleChance: 0,
  },
};

class AI {
  constructor({ difficulty = 'normal' } = {}) {
    this.difficulty = difficulty;
    this.reactionCounter = 0;
    this.targetY = 0;
    this.errorOffset = 0;
  }

  getMove(ball, paddle, court) {
    this.reactionCounter++;

    const settings = DIFFICULTY_SETTINGS[this.difficulty];

    if (this.reactionCounter % settings.reactionInterval !== 0) {
      return this._moveToward(paddle);
    }

    // Randomize error offset each reaction
    this.errorOffset = (Math.random() * 2 - 1) * settings.errorRange;

    // Ball moving away from AI paddle (AI is on right side)
    if (ball.dx < 0) {
      this.targetY = court.top + court.height / 2;
      return this._moveToward(paddle);
    }

    // Ball moving toward AI paddle
    if (this.difficulty === 'hard') {
      this.targetY = this._predictLanding(ball, paddle, court) + this.errorOffset;
    } else {
      this.targetY = ball.y + this.errorOffset;
    }

    // Easy difficulty sometimes does nothing
    if (this.difficulty === 'easy' && Math.random() < settings.idleChance) {
      return 'none';
    }

    return this._moveToward(paddle);
  }

  _moveToward(paddle) {
    const center = paddle.getCenter();
    const diff = this.targetY - center;

    if (Math.abs(diff) < 1) {
      return 'none';
    }

    return diff < 0 ? 'up' : 'down';
  }

  _predictLanding(ball, paddle, court) {
    const paddleX = paddle.getPosition().x;
    const distX = paddleX - ball.x;

    if (ball.dx <= 0) {
      return court.top + court.height / 2;
    }

    const frames = distX / ball.dx;
    let predictedY = ball.y + ball.dy * frames;

    // Account for wall bounces (use absolute court boundaries)
    const minY = court.top + 1;
    const maxY = court.bottom - 1;
    const range = maxY - minY;

    if (range > 0) {
      // Normalize into bounce space
      let offset = predictedY - minY;
      const periods = Math.floor(offset / range);
      offset = offset - periods * range;

      if (periods % 2 === 0) {
        predictedY = minY + offset;
      } else {
        predictedY = maxY - offset;
      }
    }

    return predictedY;
  }
}

module.exports = AI;
