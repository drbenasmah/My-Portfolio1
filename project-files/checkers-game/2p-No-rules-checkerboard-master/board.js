$(document).ready(function () {
  console.log("document ready");
  $("#board-container").html(renderBoard());
  renderCheckers();
});

function renderBoard() {
  let boardHTML = "";
  for (let i = 1; i <= 10; i++) {
    boardHTML += renderRow(i);
  }
  return boardHTML;
}

function renderRow(rowNum) {
  let rowHTML = `<div id="row-${rowNum}" class="row">`;
  for (let i = 1; i <= 10; i++) {
    rowHTML += renderCell(rowNum, i);
  }
  rowHTML += "</div>";
  return rowHTML;
}

function renderCell(rowNum, cellNum) {
  if (cellColor(cellNum, rowNum) === "black") {
    return `<div id="cell-${rowNum}-${cellNum}" class="cell black"></div>`;
  } else {
    return `<div id="cell-${rowNum}-${cellNum}" class="cell white"></div>`;
  }
}

/*** Helper Methods ***/
function parity(num) {
  return num % 2 === 0 ? "even" : "odd";
}

function cellColor(cellNum, rowNum) {
  return parity(cellNum) === parity(rowNum) ? "white" : "black";
}

function moveSelectedCheckerHere() {
  console.log("things");
  if (selectedChecker) {
    console.log(`move checker here`);
    let blackCell = $(this);
    console.log(`black cell: `, blackCell);
    let id = blackCell.attr("id");
    console.log(`id: `, id);
    let idParts = id.split("-");
    console.log(`idParts = `, idParts);

    selectedChecker.row = Number(idParts[1]);
    selectedChecker.cell = Number(idParts[2]);

    console.log(`the checker I'm moving is `, selectedChecker.color);
    if (selectedChecker.color === "black" && selectedChecker.row === 1) {
      console.log(`I'm moving a black checker to the white home row`);
      selectedChecker.isKing = true;
    } else if (
      selectedChecker.color === "white" &&
      selectedChecker.row === 10
    ) {
      console.log(`I'm moving a white checker to the black home row`);
      selectedChecker.isKing = true;
    }

    selectedChecker = undefined;
    renderCheckers();
  } else {
    console.log(`select a checker, foo!`);
  }
}

function clearBoard() {
  $(".black.cell").html("");
  $(".black.cell").unbind("click");
  $(".out-of-play").html("");
}
