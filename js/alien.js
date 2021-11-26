'use strict';
const ALIEN_SPEED = 800;
var gIntervalAliens;
var gAliens = [];
var gLeftCount = 0;
// var gAliensMove = [];
// var gGoRight;
// var gGoLeft;

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
        // updateCell({ i, j }, ALIEN);
        gAliens.push({ i, j });
        gGame.aliensCount += 1;
      }
    }
  }
  // console.log(gAliens);
}

function handleAlienHit(pos) {
  console.log(gIsNeighborsKill);
  updateScore(10);
  gLaserPos = [];
  gLaserCount = -1;
  clearInterval(gLaserInterval);
  gHero.isShoot = false;
  gBoard[pos.i][pos.j].gameObject = null;
  gBoard[pos.i][pos.j].deadAlien = true;
  updateCell({ i: pos.i, j: pos.j });
  if (gIsNeighborsKill) {
    blowUpNgs(pos.i, pos.j, gBoard);
  }

  // for (var i = 0; i < gAliens.length; i++) {
  //   var currAlien = gAliens[i];
  //   if (currAlien.i === pos.i && currAlien.j === pos.j) {
  //     // console.log(currAlien);
  //     gAliens.splice(gAliens.indexOf(currAlien), 1);
  //     gGame.aliensCount -= 1;
  //   }
  // }
  // console.log(gGame.aliensCount);
  // console.log(gAliens);
  if (!gGame.aliensCount) gameOver(true);
}

function shiftBoardLeft(board, fromI, toI) {
  // clearInterval(gGoRight);
  for (var i = fromI; i <= toI; i++) {
    var currRow = board[i];
    for (var j = 0; j < board.length; j++) {
      var alienPos = { i, j };
      if (currRow[j].gameObject === ALIEN) {
        if (alienPos.j === 1) {
          // clearInterval(gGoLeft);
          // gGoLeft = false;
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
        // console.log('going left', gGoLeft);

        gBoard[alienPos.i][alienPos.j - 1].gameObject = ALIEN;
        // updateCell({ i: alienPos.i, j: alienPos.j - 1 }, ALIEN);
        gBoard[alienPos.i][alienPos.j].gameObject = null;
        // updateCell(alienPos);
        renderBoard(gBoard);
      }
    }
  }
}

function shiftBoardRight(board, fromI, toI) {
  // clearInterval(gGoLeft);
  for (var i = fromI; i <= toI; i++) {
    var currRow = board[i];
    // for (var j = 0; j > board.length; j++) {
    for (var j = board.length - 1; j >= 0; j--) {
      if (currRow[j].gameObject === ALIEN) {
        var alienPos = { i, j };
        // console.log(gGoLeft);
        if (alienPos.j === board.length - 2) {
          clearInterval(gIntervalAliens);
          return shiftBoardDown(
            gBoard,
            gAliensTopRowIdx++,
            gAliensBottomRowIdx++
          );
        }
        // console.log('going right', gGoRight);

        gBoard[alienPos.i][alienPos.j + 1].gameObject = ALIEN;
        // updateCell({ i: alienPos.i, j: alienPos.j + 1 }, ALIEN);
        gBoard[alienPos.i][alienPos.j].gameObject = null;
        // updateCell(alienPos);
        renderBoard(gBoard);
      }
    }
  }
  // console.log(gAliensMove); // this and gAliens should be merged and function the same way
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
        // var nextCell = getElCell({ i: i, j: j });
        // if (nextCell.innerText === ALIEN) {
        //   updateCell({ i: i - 2, j: j });
        //   updateCell({ i: i + 1, j: j }, ALIEN);
        renderBoard(gBoard);
      }
      // console.log(nextCell);
    }
  }

  // moveAliens(1);
}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
// moveAliens();

function moveAliens() {
  // gGame.isOn = true;
  if (!gGame.isOn) return;

  // // gLeftCount++;
  // // console.log(gLeftCount);
  // if (gIsAlienFreeze) return;
  // // shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);'
  // if (dir === 1) {
  //   // console.log(gAliensTopRowIdx, gAliensBottomRowIdx);
  //   clearInterval(gGoRight);
  //   gGoLeft = setInterval(
  //     shiftBoardLeft,
  //     ALIEN_SPEED,
  //     gBoard,
  //     gAliensTopRowIdx,
  //     gAliensBottomRowIdx
  //   );
  // }
  // if (dir === 2) {
  // clearInterval(gGoLeft);
  // gGoRight = setInterval(
  shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  // shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  // shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  // );
  // goLeft = true;
  // }
  // if (dir === 3) {
  //   clearInterval(gGoRight);
  //   clearInterval(gGoLeft);

  //   gAliensTopRowIdx++;
  //   gAliensBottomRowIdx++;
  //   // renderBoard(gBoard);
  //   shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  // }
}
/////////////////////////////////////////////Broken version of main main movements///////////////////////////////////////////////
// function moveAliens(dir) {
//   gGame.isOn = true;

//   // gLeftCount++;
//   // console.log(gLeftCount);
//   if (gIsAlienFreeze) return;
//   // shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);'
//   if (dir === 1) {
//     // console.log(gAliensTopRowIdx, gAliensBottomRowIdx);
//     clearInterval(gGoRight);
//     gGoLeft = setInterval(
//       shiftBoardLeft,
//       ALIEN_SPEED,
//       gBoard,
//       gAliensTopRowIdx,
//       gAliensBottomRowIdx
//     );
//   }
//   if (dir === 2) {
//     clearInterval(gGoLeft);
//     gGoRight = setInterval(
//       shiftBoardRight,
//       ALIEN_SPEED,
//       gBoard,
//       gAliensTopRowIdx,
//       gAliensBottomRowIdx
//     );
//     // goLeft = true;
//   }
//   if (dir === 3) {
//     clearInterval(gGoRight);
//     clearInterval(gGoLeft);

//     gAliensTopRowIdx++;
//     gAliensBottomRowIdx++;
//     // renderBoard(gBoard);
//     shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
//   }
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
