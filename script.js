let board = document.getElementById("game-board");
let gameStatus = document.getElementById("game-status");
let button = document.getElementById("start-button");
let score = document.getElementById("game-score");
// let timer = document.getElementById("game-timer");
let theme = document.getElementById("theme-stylesheet");

function getQueryArray() {
  const queryString = window.location.search;

  if (!queryString) {
    return [];
  }
  
  const params = new URLSearchParams(queryString);
  const queryArray = [];

  for (const [key, value] of params.entries()) {
      queryArray.push({ [key]: value });
  }

  return queryArray[0];
}

let queryArray = getQueryArray();

if (queryArray && queryArray.treatment == '1') {
  theme.setAttribute("href", "themes/blue.css");
};

class Tile {
  index;
  element;
  number;
  game;
  active = false;

  constructor(index, game) {
    let element = document.createElement("div");
    element.classList.add("game-tile");
    element.setAttribute("data-index", index);

    let number = document.createElement("span");
    number.innerText = 0;
    number.classList.add("tile-number");
    element.appendChild(number);

    this.index = index;
    this.element = element;
    this.number = number;
    this.game = game;

    this.element.addEventListener("click", () => {
      if (this.active) {
        this.game.click(this);
      }
    })

    this.element.addEventListener("mouseover", () => {
      if (this.active) {
        this.number.innerHTML = game.round - game.currentSequence.length + 1;
        this.number.style.display = "block";
      }
    });

    this.element.addEventListener("mouseout", () => {
      if (this.active) {
        this.number.style.display = "none";
      }
    });

    board.appendChild(element);
  }
  
  activate() {
    this.active = true;

    this.element.classList.add("active");
  }

  deactivate() {
    this.active = false;

    this.number.style.display = "none";
    this.element.classList.remove("active");
  }

  destroy() {
    if (this.element) {
      board.removeChild(this.element);
    }
  }
}

class Game {
  tiles = [];
  round = 0;
  startId = 0;
  timerInterval = null;
  currentSequence = [];

  constructor() {
    button.addEventListener("click", () => {
      this.start();
    });

  }

  initialize() {
    button.style.display = "block";

    // timer.innerText = "Timer: 0";

    this.round = 0;
    this.currentSequence = [];
    this.startId++;

    // Restart tiles
    for (let tile of this.tiles) {
      tile.destroy();
    }

    this.tiles = [];

    // Create new tiles
    for (let i = 0; i < 9; i++) {
      let newTile = new Tile(i, this);

      this.tiles[i] = newTile;
    }
  }

  start() {
    button.style.display = "none";

    score.innerText = "Score: 0";

    // let timeLeft = 60;

    // function updateTimer() {
    //   timer.innerText = `Timer: ${timeLeft}`;
    //   timeLeft--;
    // }

    // updateTimer();

    // this.timerInterval = setInterval(() => {
    //   updateTimer();

    //   if (timeLeft < 0) {
    //     clearInterval(this.timerInterval);

    //     this.gameOver();
    //     this.initialize();
    //   }
    // }, 1000);

    this.startNextRound();
  }

  activateAllTiles() {
    for (let tile of this.tiles) {
      tile.activate();
    }
  }

  deactivateAllTiles() {
    for (let tile of this.tiles) {
      tile.deactivate();
    }
  }

  startNextRound() {
    this.deactivateAllTiles();

    this.round++;

    gameStatus.innerText = `Round ${this.round}`;

    this.highlightNextTile();
  }

  highlightNextTile() {
    let randomIndex = Math.floor(Math.random() * this.tiles.length);
    let tile = this.tiles[randomIndex];

    this.currentSequence.push(tile.index);

    tile.element.classList.add("highlight");
    tile.number.innerText = this.currentSequence.length;
    tile.number.style.display = "block";

    let roundTime = 1000// / Math.pow(2, this.round / 6);

    setTimeout(() => {
      tile.element.classList.remove("highlight");
      tile.number.style.display = "none";
      

    }, roundTime * 0.75);

    setTimeout(() => {
      if (this.currentSequence.length < this.round) {
        this.highlightNextTile();
      } else {
        this.waitForUserInput();
      }
    }, roundTime);

  }

  waitForUserInput() {
    gameStatus.innerText = "Your turn!";

    this.activateAllTiles();
  }

  click(tile) {
    if (this.currentSequence[0] == tile.index) {
      gameStatus.innerText = "Remaining tiles: " + (this.currentSequence.length - 1);

      this.currentSequence.shift();

      this.currentSequence

      this.deactivateAllTiles();

      if (this.currentSequence.length == 0) {
        gameStatus.innerText = "Correct! Next round!";

        score.innerText = `Score: ${this.round}`;

        setTimeout(() => {
          this.startNextRound();
        }, 1000);  
      } else {
        this.activateAllTiles();
      }

    } else {
      this.gameOver("Wrong! Game Over!");
    }
 
  }

  gameOver(message) {
    gameStatus.innerText = message || "Game Over!";

      this.deactivateAllTiles();

      setTimeout(() => {
        this.initialize();
      }, 1000);

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
  }
}

let game = new Game();

game.initialize();