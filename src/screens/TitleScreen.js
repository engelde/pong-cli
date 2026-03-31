const PONG_ART = [
  ' ████  ████  █   █  ████ ',
  ' █  █  █  █  ██  █  █    ',
  ' ████  █  █  █ █ █  █ ██ ',
  ' █     █  █  █  ██  █  █ ',
  ' █     ████  █   █  ████ ',
];

const SUBTITLE = 'A faithful recreation of the 1972 Atari classic';
const PROMPT = 'Press ENTER to start';
const FRAME_MS = 100;

class TitleScreen {
  constructor({ renderer, screenManager }) {
    this.renderer = renderer;
    this.screenManager = screenManager;
    this.animInterval = null;
    this.ballX = 0;
    this.ballDir = 1;
    this.blinkOn = true;
    this.frameCount = 0;
  }

  show() {
    const court = this.renderer.getCourt();
    this.ballX = court.left + 4;
    this.ballDir = 1;
    this.blinkOn = true;
    this.frameCount = 0;

    this._draw();

    this.animInterval = setInterval(() => {
      this.frameCount++;

      const court = this.renderer.getCourt();
      this.ballX += this.ballDir;
      if (this.ballX >= court.right - 1) {
        this.ballDir = -1;
      } else if (this.ballX <= court.left + 1) {
        this.ballDir = 1;
      }

      if (this.frameCount % 5 === 0) {
        this.blinkOn = !this.blinkOn;
      }

      this._draw();
    }, FRAME_MS);
  }

  hide() {
    if (this.animInterval) {
      clearInterval(this.animInterval);
      this.animInterval = null;
    }
  }

  handleKey(key) {
    if (key === 'ENTER') {
      this.screenManager.show('menu');
    }
    if (key === 'q' || key === 'Q' || key === 'CTRL_C') {
      process.exit(0);
    }
  }

  _draw() {
    const r = this.renderer;
    const court = r.getCourt();
    const centerY = Math.floor((court.top + court.bottom) / 2);
    const titleStartY = centerY - 5;
    const fullWidth = court.right - court.left + 1;

    r.clear();

    for (let i = 0; i < PONG_ART.length; i++) {
      r.drawMessage(PONG_ART[i], titleStartY + i);
    }

    r.drawMessage(SUBTITLE, titleStartY + PONG_ART.length + 2);

    // Bouncing ball — build a full-width line with the ball at ballX
    const ballY = titleStartY + PONG_ART.length + 4;
    const padding = Math.max(0, this.ballX - court.left);
    const ballLine = (' '.repeat(padding) + '●').padEnd(fullWidth, ' ');
    r.drawMessage(ballLine, ballY);

    if (this.blinkOn) {
      r.drawMessage(PROMPT, titleStartY + PONG_ART.length + 6);
    }

    r.drawMessage('Press Q to quit', court.bottom - 1);

    r.render();
  }
}

module.exports = TitleScreen;
