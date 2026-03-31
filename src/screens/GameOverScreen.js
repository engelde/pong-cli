class GameOverScreen {
  constructor({ renderer, screenManager }) {
    this.renderer = renderer;
    this.screenManager = screenManager;
    this.lastGameMode = 'single';
    this.lastDifficulty = 'normal';
  }

  show(data = {}) {
    const { winner, scores = { player1: 0, player2: 0 }, gameMode = 'single', difficulty = 'normal' } = data;

    this.lastGameMode = gameMode;
    this.lastDifficulty = difficulty;

    const r = this.renderer;
    const court = r.getCourt();
    const midY = Math.floor((court.top + court.bottom) / 2);

    r.clear();

    r.drawMessage('════════════════════════', midY - 6);
    r.drawMessage('GAME OVER', midY - 4);
    r.drawMessage('════════════════════════', midY - 2);

    // Winner announcement
    let winnerText;
    if (gameMode === 'single') {
      winnerText = winner === 1 ? 'YOU WIN!' : 'COMPUTER WINS!';
    } else {
      winnerText = 'PLAYER ' + winner + ' WINS!';
    }
    r.drawMessage(winnerText, midY);

    // Final score
    r.drawMessage(scores.player1 + '  -  ' + scores.player2, midY + 2);

    // Options
    r.drawMessage('[R] PLAY AGAIN  [M] MAIN MENU  [Q] QUIT', midY + 5);
    r.drawMessage('Press ENTER to play again', midY + 7);

    r.render();
  }

  hide() {
    // nothing to clean up
  }

  handleKey(key) {
    if (key === 'ENTER' || key === 'r' || key === 'R') {
      this.screenManager.show('game', {
        gameMode: this.lastGameMode,
        difficulty: this.lastDifficulty,
      });
    } else if (key === 'm' || key === 'M') {
      this.screenManager.show('menu');
    } else if (key === 'q' || key === 'Q' || key === 'CTRL_C') {
      process.exit(0);
    }
  }
}

module.exports = GameOverScreen;
