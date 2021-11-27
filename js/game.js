'use strict';

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 9;
const ALIENS_ROW_COUNT = 3;
const HERO = '🤘';
const ALIEN = '🐙';
const GROUND = 'GROUND';
const SPACE = 'SPACE';
const WALL = 'WALL';
const CANDY = '🍫';
var LASER = '❗';

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gScore = 0;
var gBoardLength = 14;
var gBoardHeight = 14;
var gGame = {
  isOn: false,
  aliensCount: 0,
};
var gSuperCount = 3;
var gCandyInterval;

function startGame() {
  gGame.isOn = true;
  hideModal();
  setTimeout(function () {
    gCandyInterval = setInterval(placeCandy, 10000);
  }, 1000);
}

// Called when game loads
function init() {
  clearInterval(gIntervalAliens);
  clearInterval(gCandyInterval);
  gHero.pos = { i: 12, j: 5 };
  gScore = 0;
  gBoard = createBoard(gBoardLength, gBoardHeight);
  createAliens(gBoard, 3, 5);
  createHero(gBoard);
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED);
  renderBoard(gBoard);
  updateScore(0);
  hideModal();
  var elPlay = document.querySelector('.play');
  elPlay.style.display = 'block';
  console.log(gIsSuper);
}

function hideModal() {
  var elRestart = document.querySelector('.restart');
  elRestart.style.display = 'none';
}

function placeCandy() {
  var randomCell = getEmptyLocation(gBoard);
  if (!randomCell) return;
  gBoard[randomCell.i][randomCell.j].gameObject = CANDY;
  updateCell(randomCell, CANDY);
  setTimeout(function () {
    if (gBoard[randomCell.i][randomCell.j].gameObject !== gHero) {
      gBoard[randomCell.i][randomCell.j].gameObject = null;
      updateCell(randomCell);
    }
  }, 5000);
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens

function createBoard(length, height) {
  var board = createMat(length, height);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = createCell();
      if (i === board[0].length - 1) cell.type = GROUND;
      if (i === 0 || j === 0 || j === board[0].length - 1) {
        cell.type = WALL;
      }
      board[i][j] = cell;
    }
  }

  return board;
}

// Render the board as a <table> to the page
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });

      if (cell.type === GROUND) {
        cellClass += ' ground';
      } else if (cell.type === SPACE) {
        cellClass += ' space';
      } else {
        cellClass += ' wall';
      }

      strHTML += `<td data-i="${i}" data-j="${j}" class="cell ${cellClass}" >`;

      if (cell.gameObject === HERO) {
        strHTML += HERO;
      } else if (cell.gameObject === CANDY) {
        strHTML += CANDY;
      } else if (cell.gameObject === ALIEN) {
        strHTML += ALIEN;
      }
      strHTML += '</td>';
    }
    strHTML += '</tr>';
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function updateScore(score) {
  gScore += score;
  var elScore = document.querySelector('.counter');
  elScore.innerText = gScore;
}
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
  return {
    type: SPACE,
    gameObject: gameObject,
  };
}

function gameOver(isWin = false) {
  init();
  createHero(gBoard);
  console.log('GAME OVER');
  gGame.isOn = false;
  var elPlay = document.querySelector('.play');
  elPlay.style.display = 'none';
  var elRestart = document.querySelector('.restart');
  elRestart.style.display = 'block';
  var elLost = document.querySelector('.modal');
  elLost.innerText = isWin
    ? 'You won! press Restart to play again'
    : 'Game Over! press Restart to play again';
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject;
  var elCell = getElCell(pos);

  elCell.innerHTML = gameObject || '';
}
