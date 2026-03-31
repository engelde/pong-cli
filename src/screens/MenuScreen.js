const MODE_OPTIONS = ['1 PLAYER', '2 PLAYERS'];
const DIFFICULTY_OPTIONS = ['EASY', 'NORMAL', 'HARD'];
const DIFFICULTY_MAP = { 0: 'easy', 1: 'normal', 2: 'hard' };
const STEP_MODE = 0;
const STEP_DIFFICULTY = 1;
const STEP_READY = 2;

class MenuScreen {
  constructor({ renderer, screenManager }) {
    this.renderer = renderer;
    this.screenManager = screenManager;
    this.step = STEP_MODE;
    this.selectedIndex = 0;
    this.gameMode = 'single';
    this.difficulty = 'normal';
  }

  show() {
    this.step = STEP_MODE;
    this.selectedIndex = 0;
    this.gameMode = 'single';
    this.difficulty = 'normal';
    this._draw();
  }

  hide() {
    this.step = STEP_MODE;
    this.selectedIndex = 0;
  }

  handleKey(key) {
    if (key === 'q' || key === 'CTRL_C') {
      process.exit(0);
    }

    if (key === 'ESCAPE') {
      this._goBack();
      return;
    }

    if (key === 'UP') {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      this._draw();
    } else if (key === 'DOWN') {
      const max = this.step === STEP_DIFFICULTY ? DIFFICULTY_OPTIONS.length - 1 : MODE_OPTIONS.length - 1;
      this.selectedIndex = Math.min(max, this.selectedIndex + 1);
      this._draw();
    } else if (key === 'ENTER') {
      this._confirm();
    }
  }

  _confirm() {
    if (this.step === STEP_MODE) {
      this.gameMode = this.selectedIndex === 0 ? 'single' : 'multi';
      if (this.gameMode === 'single') {
        this.step = STEP_DIFFICULTY;
        this.selectedIndex = 1; // Default to NORMAL
      } else {
        this.step = STEP_READY;
        this.selectedIndex = 0;
      }
      this._draw();
    } else if (this.step === STEP_DIFFICULTY) {
      this.difficulty = DIFFICULTY_MAP[this.selectedIndex] || 'normal';
      this.step = STEP_READY;
      this.selectedIndex = 0;
      this._draw();
    } else if (this.step === STEP_READY) {
      this.screenManager.show('game', {
        gameMode: this.gameMode,
        difficulty: this.difficulty,
      });
    }
  }

  _goBack() {
    if (this.step === STEP_READY) {
      this.step = this.gameMode === 'single' ? STEP_DIFFICULTY : STEP_MODE;
      this.selectedIndex = 0;
      this._draw();
    } else if (this.step === STEP_DIFFICULTY) {
      this.step = STEP_MODE;
      this.selectedIndex = 0;
      this._draw();
    } else {
      this.screenManager.show('title');
    }
  }

  _draw() {
    const r = this.renderer;
    const court = r.getCourt();
    const centerY = Math.floor((court.top + court.bottom) / 2);

    r.clear();

    r.drawMessage('══════ PONG ══════', centerY - 7);

    if (this.step === STEP_MODE) {
      r.drawMessage('SELECT GAME MODE', centerY - 4);
      this._drawOptions(MODE_OPTIONS, this.selectedIndex, centerY - 2);
      r.drawMessage('↑/↓ to select  •  ENTER to confirm  •  ESC to go back', court.bottom - 1);
    } else if (this.step === STEP_DIFFICULTY) {
      r.drawMessage('SELECT DIFFICULTY', centerY - 4);
      this._drawOptions(DIFFICULTY_OPTIONS, this.selectedIndex, centerY - 2);
      r.drawMessage('↑/↓ to select  •  ENTER to confirm  •  ESC to go back', court.bottom - 1);
    } else if (this.step === STEP_READY) {
      const modeLabel = this.gameMode === 'single' ? '1 PLAYER' : '2 PLAYERS';
      r.drawMessage('GAME SETTINGS', centerY - 4);
      r.drawMessage('Mode: ' + modeLabel, centerY - 2);
      if (this.gameMode === 'single') {
        r.drawMessage('Difficulty: ' + this.difficulty.toUpperCase(), centerY);
      }
      r.drawMessage('Press ENTER to start', centerY + 3);
      r.drawMessage('ESC to go back', court.bottom - 1);
    }

    r.render();
  }

  _drawOptions(options, selectedIndex, startY) {
    const r = this.renderer;
    for (let i = 0; i < options.length; i++) {
      const prefix = i === selectedIndex ? '▸ ' : '  ';
      r.drawMessage(prefix + options[i], startY + i * 2);
    }
  }
}

module.exports = MenuScreen;
