class Paddle {
  constructor({ x, y, height = 5, speed = 1, courtTop = 0, courtBottom }) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.speed = speed;
    this.courtTop = courtTop;
    this.courtBottom = courtBottom;
  }

  moveUp() {
    this.y = Math.max(this.courtTop, this.y - this.speed);
  }

  moveDown() {
    this.y = Math.min(this.courtBottom - this.height + 1, this.y + this.speed);
  }

  getPosition() {
    return { x: this.x, y: this.y, height: this.height };
  }

  getBounds() {
    return {
      top: this.y,
      bottom: this.y + this.height - 1,
      left: this.x,
      right: this.x,
    };
  }

  getCenter() {
    return this.y + this.height / 2;
  }

  reset(y) {
    this.y = y;
  }

  containsY(ballY) {
    return ballY >= this.y && ballY <= this.y + this.height - 1;
  }
}

module.exports = Paddle;
