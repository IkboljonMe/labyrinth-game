"use strict";

//TASKS:

//• Labyrinth generator of any size. – Grade 4
//• Possibility of collecting keys / boards with protected doors. – Grade 5

const screen = document.querySelector(".game-screen-container");
const timeShown = document.querySelector("#time");
const livesShown = document.querySelector("#lives");
const recordShown = document.querySelector("#record");
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

class ItemPos {
  constructor(posX = null, posY = null) {
    this.x = posX;
    this.y = posY;
  }
}

/* Initial Values */
let theGameStarted = false;

let canvasSize = null;
let gridSize = null;
let elementsSize = null;

const playerPos = new ItemPos();
const giftPos = new ItemPos();
let bombsPos = [];

let currentLevel = 0;
let currentLives = 5;
let totalGameTime = 0;
const lastLevel = maps.length - 1;
let currentRecord = Number(localStorage.getItem("record"));

timeShown.innerText = "--";
livesShown.innerText = "-- -- -- -- --";
currentRecord
  ? (recordShown.innerText = formatSeconds(currentRecord))
  : (recordShown.innerText = "--");

const MAP_LIMITS = {
  UP: 1,
  LEFT: 1,
  RIGHT: 10,
  DOWN: 10,
};

/* Event Listeners */
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
window.addEventListener("load", showMainMenu);
window.addEventListener("keydown", moveByKeys);
document.getElementById("up").addEventListener("click", moveByClicks);
document.getElementById("left").addEventListener("click", moveByClicks);
document.getElementById("right").addEventListener("click", moveByClicks);
document.getElementById("down").addEventListener("click", moveByClicks);

/* Game Logic */
let currentTimer = null;
function startTimer() {
  timeShown.innerText = "";
  currentTimer = setInterval(() => {
    totalGameTime++;
    const currentTime = formatSeconds(totalGameTime);
    timeShown.innerText = currentTime;
  }, 1000);
}

//• Labyrinth generator of any size. – Grade 4

function setCanvasSize() {
  if (window.innerHeight < window.innerWidth) {
    canvasSize = window.innerHeight * 0.8;
  } else {
    canvasSize = window.innerWidth * 0.8;
  }

  canvasSize = Math.trunc(canvasSize);
  gridSize = Math.trunc(canvasSize / 10);
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  if (theGameStarted) renderMap();
}

function renderMap() {
  elementsSize = gridSize;
  game.textAlign = "start";
  game.font = `${elementsSize}px sans-serif`;

  let actualMap = maps[currentLevel];
  const mapRows = actualMap.trim().split("\n");
  const mapElements = mapRows.map((row) => row.trim().split(""));

  game.clearRect(0, 0, canvasSize, canvasSize);
  let isFirstLoad = playerPos.x === null && playerPos.y === null;
  let playerMoved = playerPos.x !== null && playerPos.y !== null;

  mapElements.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const posX = colIndex * gridSize; // 0 ~ 9
      const posY = (rowIndex + 1) * gridSize; // 1 ~ 10
      game.fillText(emoji, posX, posY);

      if (isFirstLoad) {
        switch (emoji) {
          case "🚪":
            playerPos.x = colIndex + 1;
            playerPos.y = rowIndex + 1;
            game.fillText(emojis["PLAYER"], posX, posY);
            break;

          case "🏠":
            giftPos.x = colIndex + 1;
            giftPos.y = rowIndex + 1;
            break;

          case "#":
            bombsPos.push(new ItemPos(colIndex + 1, rowIndex + 1));
            break;
        }
      }
    });
  });

  if (playerMoved) {
    const posX = (playerPos.x - 1) * gridSize; // 0 ~ 9
    const posY = playerPos.y * gridSize; // 1 ~ 10
    game.fillText(emojis["PLAYER"], posX, posY);

    wasAnyBombHit();
    wasTheLevelComplete();
  }
}

/* Player Movement */

//BASED ON:
//Each of the numbers specifies the entrances / outputs for a given labyrinth chamber: Bit values determine which door can be passed.
//1 (2^0) - left,
//2 (2^1) - right,
//4 (2^2) - up,
//8 (2^3) - down.

function movePlayer(direction) {
  if (theGameStarted) {
    switch (direction) {
      case "up":
        if (playerPos.y - 1 >= MAP_LIMITS.UP) {
          playerPos.y--;
          renderMap();
        }
        break;

      case "left":
        if (playerPos.x - 1 >= MAP_LIMITS.LEFT) {
          playerPos.x--;
          renderMap();
        }
        break;

      case "right":
        if (playerPos.x + 1 <= MAP_LIMITS.RIGHT) {
          playerPos.x++;
          renderMap();
        }
        break;

      case "down":
        if (playerPos.y + 1 <= MAP_LIMITS.DOWN) {
          playerPos.y++;
          renderMap();
        }
        break;
    }
  }
}

function moveByClicks(clickEvent) {
  switch (clickEvent.target.id) {
    case "up":
      movePlayer("up");
      break;
    case "left":
      movePlayer("left");
      break;
    case "right":
      movePlayer("right");
      break;
    case "down":
      movePlayer("down");
      break;
  }
}

function moveByKeys(keyEvent) {
  switch (keyEvent.code) {
    case "ArrowUp":
      movePlayer("up");
      break;
    case "ArrowLeft":
      movePlayer("left");
      break;
    case "ArrowRight":
      movePlayer("right");
      break;
    case "ArrowDown":
      movePlayer("down");
      break;

    case "KeyW":
      movePlayer("up");
      break;
    case "KeyA":
      movePlayer("left");
      break;
    case "KeyD":
      movePlayer("right");
      break;
    case "KeyS":
      movePlayer("down");
      break;
  }
}

/* Win and Lose Conditions */
function endGame(wonOrLost) {
  theGameStarted = false;
  switch (wonOrLost) {
    case "won":
      clearInterval(currentTimer);
      game.clearRect(0, 0, canvasSize, canvasSize);
      showGameWonMenu();

      if (totalGameTime < currentRecord || currentRecord === 0) {
        currentRecord = totalGameTime;
        localStorage.setItem("record", totalGameTime);
        recordShown.innerText = formatSeconds(currentRecord);
      }
      break;

    case "lost":
      console.log("GAME OVER.");
      game.clearRect(0, 0, canvasSize, canvasSize);
      clearInterval(currentTimer);
      showGameLostMenu();
      break;
  }
}

// Win Condition
function wasTheLevelComplete() {
  const itWas = playerPos.x === giftPos.x && playerPos.y === giftPos.y;
  if (itWas) {
    if (currentLevel !== lastLevel) {
      console.log("¡Pasaste de Nivel!");
      resetAllPositions();
      currentLevel++;
      renderMap();
    } else {
      endGame("won");
    }
  }
}

// Lose Condition
function wasAnyBombHit() {
  const itWas = bombsPos.find(
    (bomb) => bomb.x === playerPos.x && bomb.y === playerPos.y
  );
  if (itWas) {
    currentLives--;
    updateLivesShown();

    if (currentLives > 0) {
      resetAllPositions();
      renderMap();
    } else {
      endGame("lost");
    }
  }
}

/* Menus */

// Main Menu
const mainMenuContainer = document.createElement("div");
mainMenuContainer.classList.add("game-menu");

const mainMenuTitle = document.createElement("h2");
mainMenuTitle.innerText = "Simple Maze";
mainMenuTitle.classList.add("game-menu__item");
mainMenuTitle.classList.add("game-menu__item--title");

const mainMenuBtn = document.createElement("button");
mainMenuBtn.innerText = "Start game";
mainMenuBtn.classList.add("game-menu__item");
mainMenuBtn.classList.add("game-menu__item--btn");
mainMenuBtn.addEventListener("click", startGame);

screen.appendChild(mainMenuContainer);
mainMenuContainer.appendChild(mainMenuTitle);
mainMenuContainer.appendChild(mainMenuBtn);
function showMainMenu() {
  mainMenuContainer.classList.remove("inactive");
}
function hideMainMenu() {
  mainMenuContainer.classList.add("inactive");
}

// Win Menu
const wonGameMenuContainer = document.createElement("div");
wonGameMenuContainer.classList.add("game-menu");
wonGameMenuContainer.classList.add("inactive");

const wonGameMenuTitle = document.createElement("h2");
wonGameMenuTitle.innerText = "You won";
wonGameMenuTitle.classList.add("game-menu__item");
wonGameMenuTitle.classList.add("game-menu__item--title");

const wonGameMenuTryAgainBtn = document.createElement("button");
wonGameMenuTryAgainBtn.innerText = "Beat record";
wonGameMenuTryAgainBtn.classList.add("game-menu__item");
wonGameMenuTryAgainBtn.classList.add("game-menu__item--btn");
wonGameMenuTryAgainBtn.addEventListener("click", startGame);

screen.appendChild(wonGameMenuContainer);
wonGameMenuContainer.appendChild(wonGameMenuTitle);
wonGameMenuContainer.appendChild(wonGameMenuTryAgainBtn);
function showGameWonMenu() {
  wonGameMenuContainer.classList.remove("inactive");
}
function hideGameWonMenu() {
  wonGameMenuContainer.classList.add("inactive");
}

// Lose Menu
const lostGameMenuContainer = document.createElement("div");
lostGameMenuContainer.classList.add("game-menu");
lostGameMenuContainer.classList.add("inactive");

const lostGameMenuTitle = document.createElement("h2");
lostGameMenuTitle.innerText = "You've lost";
lostGameMenuTitle.classList.add("game-menu__item");
lostGameMenuTitle.classList.add("game-menu__item--title");

const lostGameMenuTryAgainBtn = document.createElement("button");
lostGameMenuTryAgainBtn.innerText = "Try again";
lostGameMenuTryAgainBtn.classList.add("game-menu__item");
lostGameMenuTryAgainBtn.classList.add("game-menu__item--btn");
lostGameMenuTryAgainBtn.addEventListener("click", startGame);

screen.appendChild(lostGameMenuContainer);
lostGameMenuContainer.appendChild(lostGameMenuTitle);
lostGameMenuContainer.appendChild(lostGameMenuTryAgainBtn);
function showGameLostMenu() {
  lostGameMenuContainer.classList.remove("inactive");
}
function hideGameLostMenu() {
  lostGameMenuContainer.classList.add("inactive");
}

function startGame() {
  hideMainMenu();
  hideGameWonMenu();
  hideGameLostMenu();

  theGameStarted = true;
  totalGameTime = 0;
  currentLevel = 0;
  currentLives = 5;
  resetAllPositions();

  showPlayerLives();
  startTimer();
  renderMap();
}

function showPlayerLives() {
  livesShown.innerText = emojis["HEART"].repeat(currentLives);
}
function updateLivesShown() {
  livesShown.innerText = emojis["HEART"].repeat(currentLives);
}

function resetAllPositions() {
  playerPos.x = null;
  playerPos.y = null;

  giftPos.x = null;
  giftPos.y = null;

  bombsPos = [];
}

function formatSeconds(timeInSeconds) {
  const totalTime = {
    hrs: 0,
    min: 0,
    sec: 0,
  };

  let counter = timeInSeconds;
  while (counter > 0) {
    if (counter >= 3600) {
      totalTime.hrs = Math.trunc(counter / 3600);
      counter -= 3600 * Math.trunc(counter / 3600);
    } else if (counter >= 60) {
      totalTime.min = Math.trunc(counter / 60);
      counter -= 60 * Math.trunc(counter / 60);
    } else if (counter >= 1) {
      totalTime.sec = counter;
      counter -= counter;
    }
  }

  let totalTimeInString = "";
  if (totalTime.hrs > 0) totalTimeInString += `${totalTime.hrs} h `;
  if (totalTime.min > 0) totalTimeInString += `${totalTime.min} min `;
  if (totalTime.sec > 0) totalTimeInString += `${totalTime.sec} s`;

  return totalTimeInString.trim();
}
