class Sound {
  constructor({ enabled = true } = {}) {
    this.enabled = enabled;
  }

  paddleHit() {
    this._beep(1);
  }

  wallBounce() {
    this._beep(1);
  }

  score() {
    this._beep(2);
  }

  gameOver() {
    this._beep(3);
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  _beep(count = 1) {
    if (!this.enabled) return;
    process.stdout.write('\x07'.repeat(count));
  }
}

module.exports = Sound;
