class Piece {
  constructor(x, y, size, pType) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.pieceType = pType;
  }

  draw(context) {
    context.drawImage(
      imgs[this.pieceType],
      this.x + 5,
      this.y + 5,
      this.size / 1.2,
      this.size / 1.2
    );
  }

  mouseMove(mp) {
    this.size = mp.size * 1.2;
    this.x = mp.x - this.size / 1.7;
    this.y = mp.y - this.size / 1.5;
  }

  move(src, target, tiles) {
    return movePiece(src, target, BOARD_DEF);
  }
}
