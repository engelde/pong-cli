const termkit = require('terminal-kit');
const Theme = require('./Theme');

class Renderer {
  constructor({ terminal }) {
    this.terminal = terminal;
    this.screenBuffer = null;
    this.width = 0;
    this.height = 0;
    this.courtTop = 0;
    this.courtBottom = 0;
    this.courtLeft = 0;
    this.courtRight = 0;
  }

  init() {
    this.width = this.terminal.width;
    this.height = this.terminal.height;
    this._createBuffer();
    this._calculateCourt();
  }

  _createBuffer() {
    this.screenBuffer = new termkit.ScreenBuffer({
      dst: this.terminal,
      width: this.width,
      height: this.height,
    });
  }

  _calculateCourt() {
    this.courtTop = 8;
    this.courtBottom = this.height - 1;
    this.courtLeft = 0;
    this.courtRight = this.width - 1;
  }

  clear() {
    this.screenBuffer.fill({
      char: ' ',
      attr: { color: 'white', bgColor: 'black' },
    });
  }

  drawCourt() {
    const attr = { color: 'white', bgColor: 'black' };

    // Top border
    this.screenBuffer.put({ x: this.courtLeft, y: this.courtTop, attr }, Theme.CORNER_TL);
    for (let x = this.courtLeft + 1; x < this.courtRight; x++) {
      this.screenBuffer.put({ x, y: this.courtTop, attr }, Theme.BORDER_TOP);
    }
    this.screenBuffer.put({ x: this.courtRight, y: this.courtTop, attr }, Theme.CORNER_TR);

    // Bottom border
    this.screenBuffer.put({ x: this.courtLeft, y: this.courtBottom, attr }, Theme.CORNER_BL);
    for (let x = this.courtLeft + 1; x < this.courtRight; x++) {
      this.screenBuffer.put({ x, y: this.courtBottom, attr }, Theme.BORDER_TOP);
    }
    this.screenBuffer.put({ x: this.courtRight, y: this.courtBottom, attr }, Theme.CORNER_BR);

    // Side borders
    for (let y = this.courtTop + 1; y < this.courtBottom; y++) {
      this.screenBuffer.put({ x: this.courtLeft, y, attr }, Theme.BORDER_SIDE);
      this.screenBuffer.put({ x: this.courtRight, y, attr }, Theme.BORDER_SIDE);
    }

    // Center net (dashed)
    const centerX = Math.floor(this.width / 2);
    for (let y = this.courtTop + 1; y < this.courtBottom; y++) {
      const ch = (y - this.courtTop) % 2 === 1 ? Theme.NET : Theme.NET_GAP;
      this.screenBuffer.put({ x: centerX, y, attr }, ch);
    }
  }

  drawPaddle(paddle) {
    const { x, y, height } = paddle.getPosition();
    const attr = { color: 'white', bgColor: 'black' };

    for (let i = 0; i < height; i++) {
      const drawY = y + i;
      if (drawY > this.courtTop && drawY < this.courtBottom) {
        this.screenBuffer.put({ x, y: drawY, attr }, Theme.PADDLE);
      }
    }
  }

  drawBall(ball) {
    const { x, y } = ball.getPosition();
    const drawX = Math.round(x);
    const drawY = Math.round(y);
    const attr = { color: 'white', bgColor: 'black' };

    if (drawX > this.courtLeft && drawX < this.courtRight && drawY > this.courtTop && drawY < this.courtBottom) {
      this.screenBuffer.put({ x: drawX, y: drawY, attr }, Theme.BALL);
    }
  }

  drawScore(p1Score, p2Score) {
    const attr = { color: 'white', bgColor: 'black' };
    const quarterX = Math.floor(this.width / 4);
    const threeQuarterX = Math.floor((this.width * 3) / 4);

    this._drawNumber(p1Score, quarterX, 1, attr);
    this._drawNumber(p2Score, threeQuarterX, 1, attr);
  }

  _drawNumber(number, centerX, startY, attr) {
    const digits = String(number).split('').map(Number);
    const digitWidth = 4; // 3 chars + 1 space gap
    const totalWidth = digits.length * digitWidth - 1;
    let x = centerX - Math.floor(totalWidth / 2);

    for (const digit of digits) {
      this._drawDigit(digit, x, startY, attr);
      x += digitWidth;
    }
  }

  _drawDigit(digit, startX, startY, attr) {
    const lines = Theme.SCORE_DIGITS[digit];
    if (!lines) return;

    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];
      for (let col = 0; col < line.length; col++) {
        this.screenBuffer.put({ x: startX + col, y: startY + row, attr }, line[col]);
      }
    }
  }

  drawMessage(text, row) {
    const attr = { color: 'white', bgColor: 'black' };
    const startX = Math.floor((this.width - text.length) / 2);

    for (let i = 0; i < text.length; i++) {
      this.screenBuffer.put({ x: startX + i, y: row, attr }, text[i]);
    }
  }

  render() {
    this.screenBuffer.draw({ delta: true });
  }

  resize() {
    this.width = this.terminal.width;
    this.height = this.terminal.height;
    this._createBuffer();
    this._calculateCourt();
  }

  getCourt() {
    return {
      top: this.courtTop,
      bottom: this.courtBottom,
      left: this.courtLeft,
      right: this.courtRight,
      width: this.courtRight - this.courtLeft + 1,
      height: this.courtBottom - this.courtTop + 1,
    };
  }
}

module.exports = Renderer;
