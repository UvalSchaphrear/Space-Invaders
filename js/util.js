'use strict';
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
  return {
    type: SPACE,
    gameObject: gameObject,
  };
}
function getElCell(pos) {
  return document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`);
}

function createMat(ROWS, COLS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}
function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function getEmptyLocation(board) {
  var emptyCells = getEmptyCells(board);
  var randIdx = getRandomInt(0, emptyCells.length);
  var randomCell = emptyCells.length > 0 ? emptyCells[randIdx] : null;
  return randomCell;
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 12; i < board.length - 1; i++) {
    for (var j = 0; j < board[i].length - 1; j++) {
      if (board[12][j].type === SPACE && board[12][j].gameObject === null)
        emptyCells.push({ i, j });
    }
  }
  return emptyCells;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
