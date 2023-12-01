document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
  ];

  const pieces = [];
  const tiles = [];

  // Distance formula
  const dist = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  // Piece class
  class Piece {
    constructor(element, position) {
      this.allowedToMove = true;
      this.element = element;
      this.position = position;
      this.player = this.element.attr("id") < 12 ? 1 : 2;
      this.king = false;
    }

    makeKing() {
      this.element.css("backgroundImage", `url('img/king${this.player}.png')`);
      this.king = true;
    }

    move(tile) {
      this.element.removeClass("selected");
      if (!Board.isValidPlaceToMove(tile.position[0], tile.position[1]))
        return false;
      if (
        (this.player === 1 &&
          !this.king &&
          tile.position[0] < this.position[0]) ||
        (this.player === 2 && !this.king && tile.position[0] > this.position[0])
      ) {
        return false;
      }
      Board.board[this.position[0]][this.position[1]] = 0;
      Board.board[tile.position[0]][tile.position[1]] = this.player;
      this.position = [tile.position[0], tile.position[1]];
      this.element.css("top", Board.dictionary[this.position[0]]);
      this.element.css("left", Board.dictionary[this.position[1]]);
      if (!this.king && (this.position[0] === 0 || this.position[0] === 7))
        this.makeKing();
      return true;
    }

    canJumpAny() {
      return (
        this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] - 2])
      );
    }

    canOpponentJump(newPosition) {
      const dx = newPosition[1] - this.position[1];
      const dy = newPosition[0] - this.position[0];
      if (
        (this.player === 1 &&
          !this.king &&
          newPosition[0] < this.position[0]) ||
        (this.player === 2 && !this.king && newPosition[0] > this.position[0])
      ) {
        return false;
      }
      if (
        newPosition[0] > 7 ||
        newPosition[1] > 7 ||
        newPosition[0] < 0 ||
        newPosition[1] < 0
      ) {
        return false;
      }
      const tileToCheckx = this.position[1] + dx / 2;
      const tileToChecky = this.position[0] + dy / 2;
      if (
        tileToCheckx > 7 ||
        tileToChecky > 7 ||
        tileToCheckx < 0 ||
        tileToChecky < 0
      ) {
        return false;
      }
      if (
        !Board.isValidPlaceToMove(tileToChecky, tileToCheckx) &&
        Board.isValidPlaceToMove(newPosition[0], newPosition[1])
      ) {
        for (const piece of pieces) {
          if (
            piece.position[0] === tileToChecky &&
            piece.position[1] === tileToCheckx
          ) {
            if (this.player !== piece.player) {
              return piece;
            }
          }
        }
      }
      return false;
    }

    opponentJump(tile) {
      const pieceToRemove = this.canOpponentJump(tile.position);
      if (pieceToRemove) {
        pieceToRemove.remove();
        return true;
      }
      return false;
    }

    remove() {
      this.element.css("display", "none");
      if (this.player === 1) {
        $("#player2").append("<div class='capturedPiece'></div>");
        Board.score.player2 += 1;
      }
      if (this.player === 2) {
        $("#player1").append("<div class='capturedPiece'></div>");
        Board.score.player1 += 1;
      }
      Board.board[this.position[0]][this.position[1]] = 0;
      this.position = [];
      const playerWon = Board.checkIfAnybodyWon();
      if (playerWon) {
        $("#winner").html(`Player ${playerWon} has won!`);
      }
    }
  }

  // Tile class
  class Tile {
    constructor(element, position) {
      this.element = element;
      this.position = position;
    }

    inRange(piece) {
      for (const k of pieces) {
        if (
          k.position[0] === this.position[0] &&
          k.position[1] === this.position[1]
        )
          return "wrong";
      }
      if (
        !piece.king &&
        ((piece.player === 1 && this.position[0] < piece.position[0]) ||
          (piece.player === 2 && this.position[0] > piece.position[0]))
      ) {
        return "wrong";
      }
      if (
        dist(
          this.position[0],
          this.position[1],
          piece.position[0],
          piece.position[1]
        ) === Math.sqrt(2)
      ) {
        return "regular";
      } else if (
        dist(
          this.position[0],
          this.position[1],
          piece.position[0],
          piece.position[1]
        ) ===
        2 * Math.sqrt(2)
      ) {
        return "jump";
      }
    }
  }

  // Board object
  const Board = {
    board: gameBoard,
    score: {
      player1: 0,
      player2: 0,
    },
    playerTurn: 1,
    jumpExist: false,
    continuousJump: false,
    tilesElement: $("div.tiles"),
    dictionary: [
      "0vmin",
      "10vmin",
      "20vmin",
      "30vmin",
      "40vmin",
      "50vmin",
      "60vmin",
      "70vmin",
      "80vmin",
      "90vmin",
    ],

    initialize() {
      let countPieces = 0;
      let countTiles = 0;
      for (const row in this.board) {
        for (const column in this.board[row]) {
          if (row % 2 === 1) {
            if (column % 2 === 0) {
              countTiles = this.tileRender(row, column, countTiles);
            }
          } else {
            if (column % 2 === 1) {
              countTiles = this.tileRender(row, column, countTiles);
            }
          }
          if (this.board[row][column] === 1) {
            countPieces = this.playerPiecesRender(1, row, column, countPieces);
          } else if (this.board[row][column] === 2) {
            countPieces = this.playerPiecesRender(2, row, column, countPieces);
          }
        }
      }
    },

    tileRender(row, column, countTiles) {
      this.tilesElement.append(
        `<div class='tile' id='tile${countTiles}' style='top:${this.dictionary[row]};left:${this.dictionary[column]};'></div>`
      );
      tiles[countTiles] = new Tile($(`#tile${countTiles}`), [
        parseInt(row),
        parseInt(column),
      ]);
      return countTiles + 1;
    },

    playerPiecesRender(playerNumber, row, column, countPieces) {
      $(`.player${playerNumber}pieces`).append(
        `<div class='piece' id='${countPieces}' style='top:${this.dictionary[row]};left:${this.dictionary[column]};'></div>`
      );
      pieces[countPieces] = new Piece($(`#${countPieces}`), [
        parseInt(row),
        parseInt(column),
      ]);
      return countPieces + 1;
    },

    isValidPlaceToMove(row, column) {
      if (row < 0 || row > 7 || column < 0 || column > 7) return false;
      return this.board[row][column] === 0;
    },

    changePlayerTurn() {
      if (this.playerTurn === 1) {
        this.playerTurn = 2;
        $(".turn").css(
          "background",
          "linear-gradient(to right, transparent 50%, #BEEE62 50%)"
        );
      } else {
        this.playerTurn = 1;
        $(".turn").css(
          "background",
          "linear-gradient(to right, #BEEE62 50%, transparent 50%)"
        );
      }
      this.checkIfJumpExist();
      return;
    },

    checkIfAnybodyWon() {
      if (this.score.player1 === 12) {
        return 1;
      } else if (this.score.player2 === 12) {
        return 2;
      }
      return false;
    },

    clear() {
      location.reload();
    },

    checkIfJumpExist() {
      this.jumpExist = false;
      this.continuousJump = false;
      for (const k of pieces) {
        k.allowedToMove = false;
        if (
          k.position.length !== 0 &&
          k.player === this.playerTurn &&
          k.canJumpAny()
        ) {
          this.jumpExist = true;
          k.allowedToMove = true;
        }
      }
      if (!this.jumpExist) {
        for (const k of pieces) k.allowedToMove = true;
      }
    },

    strBoard() {
      let ret = "";
      for (const i in this.board) {
        for (const j in this.board[i]) {
          let found = false;
          for (const k of pieces) {
            if (k.position[0] === i && k.position[1] === j) {
              ret += k.king ? this.board[i][j] + 2 : this.board[i][j];
              found = true;
              break;
            }
          }
          if (!found) ret += "0";
        }
      }
      return ret;
    },
  };

  Board.initialize();

  // Event listeners
  $(".piece").on("click", function () {
    const isPlayersTurn =
      $(this).parent().attr("class").split(" ")[0] ===
      `player${Board.playerTurn}pieces`;
    if (isPlayersTurn) {
      if (!Board.continuousJump && pieces[$(this).attr("id")].allowedToMove) {
        const selected = $(this).hasClass("selected");
        $(".piece").each((index) => {
          $(".piece").eq(index).removeClass("selected");
        });
        if (!selected) {
          $(this).addClass("selected");
        }
      } else {
        const message = !Board.continuousJump
          ? "Jump exists for other pieces; this piece is not allowed to move."
          : "Continuous jump exists; you have to jump the same piece.";
        console.log(message);
      }
    }
  });

  $("#cleargame").on("click", function () {
    Board.clear();
  });

  $(".tile").on("click", function () {
    if ($(".selected").length !== 0) {
      const tileID = $(this).attr("id").replace(/tile/, "");
      const tile = tiles[tileID];
      const piece = pieces[$(".selected").attr("id")];
      const inRange = tile.inRange(piece);
      if (inRange !== "wrong") {
        if (inRange === "jump") {
          if (piece.opponentJump(tile)) {
            piece.move(tile);
            if (piece.canJumpAny()) {
              piece.element.addClass("selected");
              Board.continuousJump = true;
            } else {
              Board.changePlayerTurn();
            }
          }
        } else if (inRange === "regular" && !Board.jumpExist) {
          if (!piece.canJumpAny()) {
            piece.move(tile);
            Board.changePlayerTurn();
          } else {
            alert("You must jump when possible!");
          }
        }
      }
    }
  });
});
