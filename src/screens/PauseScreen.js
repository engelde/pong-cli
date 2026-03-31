class PauseScreen {
  constructor({ renderer }) {
    this.renderer = renderer;
  }

  draw() {
    const court = this.renderer.getCourt();
    const midY = Math.floor((court.top + court.bottom) / 2);

    this.renderer.drawMessage('═══ PAUSED ═══', midY - 1);
    this.renderer.drawMessage('SPACE to resume', midY + 1);
    this.renderer.drawMessage('ESC to quit', midY + 3);
  }
}

module.exports = PauseScreen;
