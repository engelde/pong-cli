class GameState {
  constructor(options = {}) {
    const { winningScore = 11, gameMode = 'single', difficulty = 'normal' } = options;

    this.player1Score = 0;
    this.player2Score = 0;
    this.winningScore = winningScore;
    this.gameMode = gameMode;
    this.difficulty = difficulty;
    this.isPaused = false;
    this.isGameOver = false;
    this.winner = null;
    this.isPlaying = false;
    this.lastScorer = null;
  }

  score(player) {
    if (this.isGameOver) {
      return { scored: false, player, gameOver: true };
    }

    if (player === 1) {
      this.player1Score++;
    } else if (player === 2) {
      this.player2Score++;
    }

    this.lastScorer = player;
    const gameOver = this.checkWin();

    return { scored: true, player, gameOver };
  }

  checkWin() {
    if (this.player1Score >= this.winningScore) {
      this.isGameOver = true;
      this.winner = 1;
      return true;
    }

    if (this.player2Score >= this.winningScore) {
      this.isGameOver = true;
      this.winner = 2;
      return true;
    }

    return false;
  }

  reset() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.isGameOver = false;
    this.winner = null;
    this.isPlaying = false;
    this.lastScorer = null;
  }

  getServeDirection() {
    if (this.lastScorer === 1) return -1;
    if (this.lastScorer === 2) return 1;
    return Math.random() < 0.5 ? -1 : 1;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  getScores() {
    return {
      player1: this.player1Score,
      player2: this.player2Score,
    };
  }
}

module.exports = GameState;
