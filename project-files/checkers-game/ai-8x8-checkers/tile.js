class Tile {
  constructor(x, y, size, c, sqr, p = null) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.sqr = sqr;
    this.piece = p;
    this.isBlack = c;
    this.image = new Image();

    if (this.isBlack) {
      this.image.src = "img/dark_wood.jpg";
    } else {
      this.image.src = "img/light_wood.jpg";
    }
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);

    if (DEBUG && this.isBlack) {
      context.fillStyle = "blue";
      context.font = "30px Arial";
      context.fillText(this.sqr, this.x, this.y);
    }
  }

  drawPiece(context) {
    if (this.piece !== null) {
      this.piece.draw(context);
    }
  }
}
