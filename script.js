let board = document.getElementById("game-board");
let gameStatus = document.getElementById("game-status");
let button = document.getElementById("start-button");
let score = document.getElementById("game-score");

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

  return queryArray;
}

let queryArray = getQueryArray()[0];

if (queryArray && queryArray.treatment == '1') {
  document.documentElement.style.backgroundColor = "rgb(0, 150, 255)";
};

class Tile {
  index;
  element;
  game;
  active = false;

  constructor(index, game) {
    let element = document.createElement("div");
    element.classList.add("game-tile");
    element.setAttribute("data-index", index);

    this.index = index;
    this.element = element;
    this.game = game;

    this.element.addEventListener("click", () => {
      if (this.active) {
        this.game.click(this);
      }
    })

    board.appendChild(element);
  }
  
  activate() {
    this.active = true;

    this.element.classList.add("active");
  }

  deactivate() {
    this.active = false;

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
  currentSequence = [];

  constructor() {
    button.addEventListener("click", () => {
      this.start();
    });
  }

  initialize() {
    button.style.display = "block";

    this.round = 0;
    this.currentSequence = [];

    // Restart tiles
    for (let tile of this.tiles) {
      tile.destroy();
    }

    this.tiles = [];

    // Create new tiles
    for (let i = 0; i < 16; i++) {
      let newTile = new Tile(i, this);

      this.tiles[i] = newTile;
    }
  }

  start() {
    button.style.display = "none";

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

    setTimeout(() => {
      tile.element.classList.remove("highlight");
    }, 500);

    setTimeout(() => {
      if (this.currentSequence.length < this.round) {
        this.highlightNextTile();
      } else {
        this.waitForUserInput();
      }
    }, 1000);

  }

  waitForUserInput() {
    gameStatus.innerText = "Your turn!";

    this.activateAllTiles();
  }

  click(tile) {
    let tileElement = tile.element;
    let index = tile.index;

    console.log(`${tile.index}, ${this.currentSequence[0]}`)

    if (this.currentSequence[0] == tile.index) {
      gameStatus.innerText = "Remaining tiles: " + (this.currentSequence.length - 1);

      this.currentSequence.shift();

      this.currentSequence

      this.deactivateAllTiles();

      if (this.currentSequence.length == 0) {
        gameStatus.innerText = "Correct! Next round!";

        setTimeout(() => {
          this.startNextRound();
        }, 1000);  
      } else {
        this.activateAllTiles();
      }

    } else {
      gameStatus.innerText = `Wrong! Game over!`;

      this.deactivateAllTiles();

      setTimeout(() => {
        this.initialize();
      }, 1000);
    }
  }
}

let game = new Game();

game.initialize();