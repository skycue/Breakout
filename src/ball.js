class Ball {
  constructor(canvas, ctx, xPos, yPos, radius, color) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = xPos;
    this.y = yPos;
    this.radius = radius;
    this.dx = 0;
    this.dy = 6;
    this.color = color;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
}

module.exports = Ball;
