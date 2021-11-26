'use strict';
var LASER_SPEED = 80;
var gLaserInterval;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false };
var gLaserCount = -1;
var gLaserPos = [];
var gIsNeighborsKill = false;
var gIsSuper = false;
var gSuperCount = 4;
// creates the hero and place it on board
function createHero(board) {
  board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
  // updateCell(gHero.pos, HERO);
}

function isSuperMode() {
  LASER_SPEED = 40;
  if ((gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO)) {
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = SUPER;
  }

  if (!gIsSuper) {
    // gIsSuper = false;
    return (LASER_SPEED = 80);
  }
}

// Handle game keys
function onKeyDown(ev) {
  if (!gGame.isOn) return;
  var j = gHero.pos.j;
  switch (ev.key) {
    case 'ArrowLeft':
      moveHero(j - 1);
      break;
    case 'ArrowRight':
      moveHero(j + 1);
      break;
    case 'Q':
      gameOver(true);
      break;
    case 'f':
      clearInterval(gIntervalAliens);
      break;
    case ' ':
      shoot();
      break;
    case 'n':
      gIsNeighborsKill = true;
      break;
    case 'x':
      gIsSuper = true;
      console.log(gIsSuper);
      break;
  }
  // return moveHero(moveTo);
}

// console.log(gIsNeighborsKill);

// Move the hero right (1) or left (-1)
function moveHero(dir) {
  console.log(gIsSuper);
  if (!gGame.isOn) return;
  if (dir < 1 || dir > gBoard.length - 2) return;
  gBoard[gHero.pos.i][gHero.pos.j].gameObject = null;
  updateCell(gHero.pos);
  gBoard[gHero.pos.i][dir].gameObject = HERO;
  updateCell({ i: gHero.pos.i, j: dir }, HERO);
  gHero.pos.j = dir;
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
  console.log(LASER_SPEED);
  if (gHero.isShoot) return;
  if (!gGame.isOn) return;
  if (gIsSuper) {
    LASER_SPEED = 40;
    LASER = '❕';
    gSuperCount--;
    console.log(gSuperCount);
    console.log(LASER_SPEED);
    if (!gSuperCount) {
      gIsSuper = false;
      LASER_SPEED = 80;
      LASER = '❗';
    }
  }
  gLaserInterval = setInterval(blinkLaser, LASER_SPEED, gHero.pos);
  gHero.isShoot = true;
}
// renders a LASER at specific cell for short time and removes it

function blinkLaser(pos) {
  var i = pos.i + gLaserCount;
  var j = pos.j;
  gLaserPos.push(pos.j);

  var nextLaserPos = { i, j: gLaserPos[0] };
  var prevLaserPos = { i: i + 1, j: gLaserPos[0] };

  if (gBoard[nextLaserPos.i][nextLaserPos.j].gameObject === ALIEN) {
    clearInterval(gLaserInterval);
    gGame.aliensCount--;
    gBoard[prevLaserPos.i][prevLaserPos.j].gameObject = null;

    handleAlienHit(nextLaserPos);
    updateCell(prevLaserPos);
    return;
  }

  gBoard[nextLaserPos.i][nextLaserPos.j].gameObject = LASER;
  updateCell(nextLaserPos, LASER);

  if (gHero.pos.i !== prevLaserPos.i) {
    //// j
    gBoard[prevLaserPos.i][prevLaserPos.j].gameObject = null;
    updateCell(prevLaserPos);
  }

  // if (gBoard[nextLaserPos.i + 1][nextLaserPos.j].gameObject === ALIEN) {
  //   handleAlienHit({ i: nextLaserPos.i + 1, j: nextLaserPos.j });
  // }

  if (i === 0) {
    gLaserPos = [];
    i = pos.i;
    j = pos.j;
    gBoard[i][j].gameObject = null;
    updateCell(nextLaserPos);
    gLaserCount = 0;
    clearInterval(gLaserInterval);
    gHero.isShoot = false;
  }
  gLaserCount--;
  var nextLaserPos = { i, j: gLaserPos };
  if (gLaserCount <= -(gBoard.length - 1)) {
    clearInterval(gLaserInterval);
  }
}

// function handleAlienHit(pos) {
//   updateScore(10);
//   gLaserPos = [];
//   gLaserCount = -1;
//   clearInterval(gLaserInterval);
//   gHero.isShoot = false;
//   if (!gIsNeighborsKill) {
//     gBoard[pos.i][pos.j].gameObject = null;
//     updateCell({ i: pos.i, j: pos.j });
//     console.log(gIsNeighborsKill);
//     console.log(pos);
//   } else {
//     blowUpNgs(nextLaserPos.i, nextLaserPos.j, gBoard);
//   }
// }
