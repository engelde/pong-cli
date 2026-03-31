// Terminal cells are roughly 2× taller than wide; correct for this
// so diagonal movement looks natural on screen.
const CELL_ASPECT = 2.0;

class Ball {
  constructor({
    x = 0,
    y = 0,
    speed = 0.8,
    maxSpeed = 2.0,
    courtWidth = 80,
    courtHeight = 24,
    courtLeft = 0,
    courtTop = 0,
  } = {}) {
    this.x = x;
    this.y = y;
    this.baseSpeed = speed;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
    this.courtWidth = courtWidth;
    this.courtHeight = courtHeight;
    this.courtLeft = courtLeft;
    this.courtTop = courtTop;
    this.dx = 0;
    this.dy = 0;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  reset(direction = 1) {
    this.x = this.courtLeft + Math.floor(this.courtWidth / 2);
    this.y = this.courtTop + Math.floor(this.courtHeight / 2);
    this.speed = this.baseSpeed;

    // Launch at a random angle between ±30 degrees
    const angle = (Math.random() - 0.5) * (Math.PI / 3);
    this.dx = direction * this.speed * Math.cos(angle);
    this.dy = (this.speed * Math.sin(angle)) / CELL_ASPECT;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getDirection() {
    return this.dx >= 0 ? 1 : -1;
  }

  increaseSpeed() {
    const prevSpeed = this.speed;
    this.speed = Math.min(this.speed * 1.04, this.maxSpeed);

    if (prevSpeed > 0) {
      const scale = this.speed / prevSpeed;
      this.dx *= scale;
      this.dy *= scale;
    }
  }

  setVelocity(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }
}

Ball.CELL_ASPECT = CELL_ASPECT;

module.exports = Ball;
