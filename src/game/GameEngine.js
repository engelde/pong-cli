const Ball = require('./Ball');
const Paddle = require('./Paddle');
const Physics = require('./Physics');
const AI = require('./AI');

const SERVE_DELAY = 30;

// Target frames for ball to cross the court at base speed.
// Keeps game feel consistent regardless of terminal width.
const FRAMES_TO_CROSS = {
  easy: 90,
  normal: 75,
  hard: 60,
};

class GameEngine {
  constructor({ court, sound, gameState }) {
    this.court = court;
    this.sound = sound;
    this.gameState = gameState;

    const courtTop = court.top + 1;
    const courtBottom = court.bottom - 1;
    const courtCenterY = Math.floor((courtTop + courtBottom) / 2);
    const courtPlayHeight = courtBottom - courtTop;
    const courtWidth = court.right - court.left;

    const paddleHeight = Math.max(3, Math.floor(courtPlayHeight / 5));

    // Scale ball speed to court width
    const framesToCross = FRAMES_TO_CROSS[gameState.difficulty] || FRAMES_TO_CROSS.normal;
    const baseSpeed = courtWidth / framesToCross;
    const maxSpeed = baseSpeed * 2.0;

    this.ball = new Ball({
      courtWidth,
      courtHeight: court.bottom - court.top,
      courtLeft: court.left,
      courtTop: court.top,
      speed: baseSpeed,
      maxSpeed,
    });

    // Scale paddle speed to court height
    const paddleSpeed = Math.max(1, Math.ceil(courtPlayHeight / 20));

    this.paddle1 = new Paddle({
      x: court.left + 2,
      y: courtCenterY,
      height: paddleHeight,
      speed: paddleSpeed,
      courtTop,
      courtBottom,
    });

    this.paddle2 = new Paddle({
      x: court.right - 2,
      y: courtCenterY,
      height: paddleHeight,
      speed: paddleSpeed,
      courtTop,
      courtBottom,
    });

    this.ai = gameState.gameMode === 'single' ? new AI({ difficulty: gameState.difficulty }) : null;

    this.inputQueue = [];
    this.serveTimer = 0;
    this.isServing = false;

    this.startServe();
  }

  queueInput(action) {
    this.inputQueue.push(action);
  }

  update() {
    if (this.gameState.isPaused || this.gameState.isGameOver) {
      return;
    }

    if (this.isServing) {
      this.serveTimer--;
      if (this.serveTimer <= 0) {
        this.ball.reset(this.gameState.getServeDirection());
        this.isServing = false;
      }
      this._processInputs();
      this.inputQueue = [];
      return;
    }

    this._processInputs();

    if (this.ai && this.gameState.gameMode === 'single') {
      const move = this.ai.getMove(this.ball, this.paddle2, this.court);
      if (move === 'up') this.paddle2.moveUp();
      if (move === 'down') this.paddle2.moveDown();
    }

    this.ball.update();

    // Wall collision — clamp position to prevent bounce oscillation
    const wallTop = this.court.top + 1;
    const wallBottom = this.court.bottom - 1;
    const wallHit = Physics.checkWallCollision(this.ball, wallTop, wallBottom);
    if (wallHit) {
      Physics.applyWallBounce(this.ball, wallTop, wallBottom);
      this.sound.wallBounce();
    }

    // Paddle collision — reposition ball past paddle to prevent re-triggering
    let paddleHit = false;

    const p1Hit = Physics.checkPaddleCollision(this.ball, this.paddle1);
    if (p1Hit) {
      Physics.applyPaddleBounce(this.ball, p1Hit.hitRatio, 1);
      this.ball.x = this.paddle1.x + 1;
      this.sound.paddleHit();
      paddleHit = true;
    }

    if (!paddleHit) {
      const p2Hit = Physics.checkPaddleCollision(this.ball, this.paddle2);
      if (p2Hit) {
        Physics.applyPaddleBounce(this.ball, p2Hit.hitRatio, -1);
        this.ball.x = this.paddle2.x - 1;
        this.sound.paddleHit();
        paddleHit = true;
      }
    }

    // Scoring — skip if a paddle just saved the ball this frame
    if (!paddleHit) {
      const scorer = Physics.checkScore(this.ball, this.court.left, this.court.right);
      if (scorer) {
        const result = this.gameState.score(scorer);
        this.sound.score();
        if (result.gameOver) {
          this.sound.gameOver();
        } else {
          this.startServe();
        }
      }
    }

    this.inputQueue = [];
  }

  _processInputs() {
    for (const action of this.inputQueue) {
      if (action === 'p1Up') this.paddle1.moveUp();
      if (action === 'p1Down') this.paddle1.moveDown();
      if (action === 'p2Up') this.paddle2.moveUp();
      if (action === 'p2Down') this.paddle2.moveDown();
    }
  }

  startServe() {
    this.isServing = true;
    this.serveTimer = SERVE_DELAY;
    // Park ball at center with no velocity during serve countdown
    this.ball.x = this.ball.courtLeft + Math.floor(this.ball.courtWidth / 2);
    this.ball.y = this.ball.courtTop + Math.floor(this.ball.courtHeight / 2);
    this.ball.dx = 0;
    this.ball.dy = 0;
    this.ball.speed = this.ball.baseSpeed;
  }

  resetForNewGame() {
    const courtCenterY = Math.floor((this.court.top + 1 + this.court.bottom - 1) / 2);
    this.paddle1.reset(courtCenterY);
    this.paddle2.reset(courtCenterY);
    this.gameState.reset();
    this.startServe();
  }

  getState() {
    return {
      ball: this.ball,
      paddle1: this.paddle1,
      paddle2: this.paddle2,
      gameState: this.gameState,
      isServing: this.isServing,
    };
  }
}

module.exports = GameEngine;
