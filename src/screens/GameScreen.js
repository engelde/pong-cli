const GameState = require('../game/GameState');
const GameEngine = require('../game/GameEngine');

const FRAME_MS = Math.round(1000 / 30);

class GameScreen {
  constructor({ renderer, screenManager, sound, winningScore = 11 }) {
    this.renderer = renderer;
    this.screenManager = screenManager;
    this.sound = sound;
    this.winningScore = winningScore;
    this.engine = null;
    this.gameState = null;
    this.loopInterval = null;
    this.lastGameMode = 'single';
    this.lastDifficulty = 'normal';
  }

  show(data = {}) {
    const { gameMode = 'single', difficulty = 'normal' } = data;
    this.lastGameMode = gameMode;
    this.lastDifficulty = difficulty;

    this.gameState = new GameState({
      winningScore: this.winningScore,
      gameMode,
      difficulty,
    });
    this.gameState.isPlaying = true;

    this.engine = new GameEngine({
      court: this.renderer.getCourt(),
      sound: this.sound,
      gameState: this.gameState,
    });

    this.loopInterval = setInterval(() => {
      this._tick();
    }, FRAME_MS);
  }

  hide() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  handleKey(key) {
    if (!this.engine || !this.gameState) return;

    if (key === 'CTRL_C') {
      this.hide();
      process.exit(0);
    }

    // Pause toggle
    if (key === ' ' || key === 'p' || key === 'P') {
      if (!this.gameState.isGameOver) {
        this.gameState.togglePause();
      }
      return;
    }

    // Escape: quit to title if paused, otherwise pause first
    if (key === 'ESCAPE') {
      if (this.gameState.isPaused) {
        this.screenManager.show('title');
      } else if (!this.gameState.isGameOver) {
        this.gameState.togglePause();
      }
      return;
    }

    // Don't process movement when paused or game over
    if (this.gameState.isPaused || this.gameState.isGameOver) return;

    // Player controls
    if (this.gameState.gameMode === 'multi') {
      // 2P: W/S for P1, arrows for P2
      switch (key) {
        case 'w':
        case 'W':
          this.engine.queueInput('p1Up');
          break;
        case 's':
        case 'S':
          this.engine.queueInput('p1Down');
          break;
        case 'UP':
          this.engine.queueInput('p2Up');
          break;
        case 'DOWN':
          this.engine.queueInput('p2Down');
          break;
      }
    } else {
      // 1P: both W/S and arrows control P1
      switch (key) {
        case 'w':
        case 'W':
        case 'UP':
          this.engine.queueInput('p1Up');
          break;
        case 's':
        case 'S':
        case 'DOWN':
          this.engine.queueInput('p1Down');
          break;
      }
    }
  }

  _tick() {
    if (!this.engine || !this.gameState) return;

    if (!this.gameState.isPaused) {
      this.engine.update();
    }

    if (this.gameState.isGameOver) {
      this.hide();
      const scores = this.gameState.getScores();
      this.screenManager.show('gameover', {
        winner: this.gameState.winner,
        scores,
        gameMode: this.lastGameMode,
        difficulty: this.lastDifficulty,
      });
      return;
    }

    this._render();
  }

  _render() {
    const r = this.renderer;
    const { ball, paddle1, paddle2, isServing } = this.engine.getState();
    const scores = this.gameState.getScores();
    const court = r.getCourt();

    r.clear();
    r.drawScore(scores.player1, scores.player2);
    r.drawCourt();
    r.drawPaddle(paddle1);
    r.drawPaddle(paddle2);

    if (isServing) {
      r.drawMessage('READY', Math.floor((court.top + court.bottom) / 2));
    } else {
      r.drawBall(ball);
    }

    if (this.gameState.isPaused) {
      const midY = Math.floor((court.top + court.bottom) / 2);
      r.drawMessage('═══ PAUSED ═══', midY - 1);
      r.drawMessage('SPACE to resume', midY + 1);
      r.drawMessage('ESC to quit', midY + 3);
    }

    // Control hints
    if (this.gameState.gameMode === 'multi') {
      r.drawMessage('P1: W/S    P2: ↑/↓    SPACE: Pause', court.bottom);
    } else {
      r.drawMessage('W/S or ↑/↓: Move    SPACE: Pause', court.bottom);
    }

    r.render();
  }
}

module.exports = GameScreen;
