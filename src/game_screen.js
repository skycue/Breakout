const Ball = require("./ball");
const Paddle = require("./paddle");
const Util = require("./util");
const Brick = require("./brick");

class GameScreen {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;

    //Score Information
    this.score = 0;

    // Information for ball
    this.ballRadius = 20;
    this.ball = new Ball(canvas, ctx, 200, 300, this.ballRadius, this.getRandomColor());

    // Information for bricks
    this.bricks = this.populateBricks(3, 6);

    //Information for paddle
    this.paddleRadius = 50;
    this.paddle = new Paddle(canvas, ctx, this.canvas.width / 2, this.paddleRadius, this.getRandomColor());

    this.rightKeyDown = false;
    this.leftKeyDown = false;

    this.draw = this.draw.bind(this);
    // this.keyDownEventHandler = this.keyDownEventHandler.bind(this);
    // this.keyUpEventHandler = this.keyUpEventHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.draw();
  }

  keyDownEventHandler(e) {
    if (e.keyCode === 39) {
      this.rightKeyDown = true;
    } else if (e.keyCode === 37) {
      this.leftKeyDown = true;
    }
  }

  keyUpEventHandler(e) {
    if (e.keyCode === 39) {
      this.rightKeyDown = false;
    } else if (e.keyCode === 37) {
      this.leftKeyDown = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX;
    if (relativeX - this.paddle.radius > 0 && relativeX + this.paddle.radius < this.canvas.width) {
        this.paddle.x = relativeX;
    }
  }

  drawScore(ctx, score) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 400);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw paddle
    this.paddle.draw();

    // Draw ball
    this.ball.draw();

    //Draw score
    this.drawScore(this.ctx, this.score);

    // Draw bricks
    this.bricks.forEach(row => {
      row.forEach(brick => brick.draw());
    })

    const ballBrickCollision = this.ballCollidedBrick(this.ball, this.bricks);

    if (ballBrickCollision.collided) {
      let newBallColor = this.getRandomColor();
      while (newBallColor === this.ball.color) {
        newBallColor = this.getRandomColor();
      }
      this.ball.color = newBallColor;

      if (ballBrickCollision.collidedBottom) {
        this.ball.dy = -1 * this.ball.dy;
      } else if (ballBrickCollision.collidedSide) {
        this.ball.dx = -1 * this.ball.dx;
      }
      this.bricks[ballBrickCollision.pos[0]][ballBrickCollision.pos[1]].visible = false;

      this.score++;
    }

    // document.addEventListener("keydown", this.keyDownEventHandler, false);
    // document.addEventListener("keyup", this.keyUpEventHandler, false);
    document.addEventListener("mousemove", this.mouseMoveHandler, false);

    this.ball.move();
    //this.paddle.move(this.leftKeyDown, this.rightKeyDown);
    requestAnimationFrame(this.draw);
  }

  ballCollidedPaddle(ball, paddle) {
    if (Util.distance([ball.x, ball.y], [paddle.x, this.canvas.height]) <= ball.radius + paddle.radius) {
      return true;
    } else {
      return false;
    }
  }

  ballCollidedBrick(ball, bricks) {

    const ballPos = [ball.x, ball.y];

    for (let row = 0; row < bricks.length; row++) {
      for (let col = 0; col < bricks[row].length; col++) {
        const brick = bricks[row][col];

        if (!brick.visible) {
          continue;
        }

        const brickPos = brick.pos;

        const ballInXRange = ballPos[0] > brickPos[0] && ballPos[0] < brickPos[0] + brick.width;
        const ballInYRange = ballPos[1] > brickPos[1] && ballPos[1] < brickPos[1] + brick.height;
        const ballTouchBrickBottom = ballPos[1] - ball.radius <= brickPos[1] + brick.height;

        const ballTouchBrickLeft = ballPos[0] < brickPos[0] && ballPos[0] + ball.radius >= brickPos[0];
        const ballTouchBrickRight = ballPos[0] > brickPos[0] && ballPos[0] - ball.radius <= brickPos[0] + brick.width;

        const a = ballInYRange && ballTouchBrickLeft;
        const b = ballInYRange && ballTouchBrickRight;
        // Case 1: Ball touches bottom of brick
        if (ballInXRange && ballTouchBrickBottom) {
          return {collided: true, pos: [row, col], collidedBottom: true};
        } else if ((a) || (b)) {
          return {collided: true, pos: [row, col], collidedSide: true};
        }
      }
    }

    return {collided: false};
  }

  populateBricks(numRows, numCols) {
    const bricks = [];

    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(new Brick(this.ctx, [j * (this.canvas.width / numCols), i * (this.canvas.height / 3.5 / numRows)], this.canvas.width / numCols, this.canvas.height / 3.5 / numRows));
      }
      bricks.push(row);
    }
    return bricks;
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";

    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }
}

module.exports = GameScreen;
