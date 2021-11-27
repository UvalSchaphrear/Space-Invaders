'use strict';
const ALIEN_SPEED = 900;
var gIntervalAliens;

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx = 1;
var gAliensBottomRowIdx = 3;

var gIsAlienFreeze = false;

function createAliens(board, startIdx, endIdx) {
  for (var i = 1; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCell = board[i][j - 1];
      if (i < startIdx + 1 && j > endIdx) {
        currCell.gameObject = ALIEN;
        gGame.aliensCount += 1;
      }
    }
  }
}

function handleAlienHit(pos) {
  updateScore(10);
  gLaserPos = [];
  gLaserCount = -1;
  clearInterval(gLaserInterval);
  gHero.isShoot = false;
  gBoard[pos.i][pos.j].gameObject = null;
  checkWin();
  updateCell({ i: pos.i, j: pos.j });
  if (gIsNeighborsKill) {
    blowUpNgs(pos.i, pos.j, gBoard);
  }

  if (!gGame.aliensCount) gameOver(true);
}

function blowUpNgs(cellI, cellJ, board) {
  console.log(gIsNeighborsKill);
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j].gameObject === ALIEN) {
        board[i][j].gameObject = null;
        checkWin();
      }
    }
  }
  gIsNeighborsKill = false;
}

function shiftBoardLeft(board, fromI, toI) {
  // clearInterval(gGoRight);
  for (var i = fromI; i <= toI; i++) {
    var currRow = board[i];
    for (var j = 0; j < board.length; j++) {
      var alienPos = { i, j };
      if (currRow[j].gameObject === ALIEN) {
        if (alienPos.j === 1) {
          clearInterval(gIntervalAliens);
          gIntervalAliens = setInterval(
            shiftBoardRight,
            ALIEN_SPEED,
            gBoard,
            gAliensTopRowIdx,
            gAliensBottomRowIdx
          );
          return;
        }

        gBoard[alienPos.i][alienPos.j - 1].gameObject = ALIEN;
        gBoard[alienPos.i][alienPos.j].gameObject = null;
        renderBoard(gBoard);
      }
    }
  }
}

function shiftBoardRight(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    var currRow = board[i];
    for (var j = board.length - 1; j >= 0; j--) {
      if (currRow[j].gameObject === ALIEN) {
        var alienPos = { i, j };
        if (alienPos.j === board.length - 2) {
          clearInterval(gIntervalAliens);
          return shiftBoardDown(
            gBoard,
            gAliensTopRowIdx++,
            gAliensBottomRowIdx++
          );
        }

        gBoard[alienPos.i][alienPos.j + 1].gameObject = ALIEN;
        gBoard[alienPos.i][alienPos.j].gameObject = null;
        renderBoard(gBoard);
      }
    }
  }
}

function shiftBoardDown(board, fromI, toI) {
  if (!gGame.isOn) return;
  for (var i = toI; i >= fromI; i--) {
    var currRow = board[i];
    for (var j = board.length - 1; j >= 0; j--) {
      if (currRow[j].gameObject === ALIEN) {
        var alienPos = { i, j };
        if (board[12][j].gameObject === ALIEN) {
          return gameOver();
        }
        clearInterval(gIntervalAliens);
        gBoard[alienPos.i][alienPos.j].gameObject = null;
        gBoard[alienPos.i + 1][alienPos.j].gameObject = ALIEN;
        gIntervalAliens = setInterval(
          shiftBoardLeft,
          ALIEN_SPEED,
          gBoard,
          gAliensTopRowIdx,
          gAliensBottomRowIdx
        );

        renderBoard(gBoard);
      }
    }
  }
}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

function moveAliens() {
  if (gIsAlienFreeze) return;
  if (!gGame.isOn) return;

  shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
}

function checkWin() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].gameObject === ALIEN) return;
    }
  }
  gameOver(true);
}
