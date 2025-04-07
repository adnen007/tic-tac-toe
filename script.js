let arr = Array(9).fill(" ");
let arrEmpty = [];
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];
let level = "easy";
const levels = document.querySelectorAll(".level");

function toggleLevels() {
  levels.forEach((el) => {
    el.addEventListener("click", () => {
      level = el.textContent;

      levels.forEach((el) => {
        el.classList.remove("active");
      });

      el.classList.add("active");
    });
  });
}

toggleLevels();

function select() {
  arr = Array.from(document.querySelectorAll(".block")).map((block) => block.textContent);

  emptyArr();
}

function emptyArr() {
  arrEmpty = arr.map((val, idx) => (val === " " ? idx : null)).filter((val) => val !== null);
}

function makeMove(index) {
  const block = document.getElementById(`block-${index}`);
  block.textContent = "o";
  block.style.pointerEvents = "none";
  arr[index] = "o";
  emptyArr();
  win();
}

// the fucntion that decide the dificulty.
function smartMove() {
  // make the bot win when he can
  for (const [a, b, c] of winCombos) {
    if (arr[a] === "o" && arr[b] === "o" && arr[c] === " ") return makeMove(c);
    if (arr[a] === "o" && arr[b] === " " && arr[c] === "o") return makeMove(b);
    if (arr[a] === " " && arr[b] === "o" && arr[c] === "o") return makeMove(a);
  }

  if (level === "hard")
    for (const [a, b, c] of winCombos) {
      // block gamer when he about to win
      if (arr[a] === "x" && arr[b] === "x" && arr[c] === " ") return makeMove(c);
      if (arr[a] === "x" && arr[b] === " " && arr[c] === "x") return makeMove(b);
      if (arr[a] === " " && arr[b] === "x" && arr[c] === "x") return makeMove(a);
    }

  if (level === "hard" || level === "medium") {
    // take center if available
    if (arr[4] === " ") return makeMove(4);

    // Take a corner if available
    const corners = [0, 2, 6, 8].filter((i) => arr[i] === " ");
    if (corners.length > 0) return makeMove(corners[Math.floor(Math.random() * corners.length)]);
  }

  // Take any available move
  if (arrEmpty.length > 0) {
    const randomIndex = arrEmpty[Math.floor(Math.random() * arrEmpty.length)];
    return makeMove(randomIndex);
  }
}

function win() {
  for (const [a, b, c] of winCombos) {
    if (arr[a] !== " " && arr[a] === arr[b] && arr[b] === arr[c]) {
      winner(arr[a]);
      return;
    }
  }

  // If no winner, check for a tie
  if (arrEmpty.length === 0) tie();
}

function winner(letter) {
  document.querySelectorAll(".block").forEach((block) => {
    block.style.pointerEvents = "none";
  });
  document.getElementById("heading").textContent = `Winner ${letter}`;
  document.body.style.background = letter === "x" ? "#bcff6f81" : "#ff161681";
}

function tie() {
  document.querySelectorAll(".block").forEach((block) => {
    block.style.pointerEvents = "none";
  });
  document.getElementById("heading").textContent = "Tie";
  document.body.style.background = "#ffa754d0";
}

document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".block");

  blocks.forEach((block) => {
    block.addEventListener("click", () => {
      const id = parseInt(block.id.split("-")[1]);

      // Make a move only if the block is empty
      if (arr[id] === " ") {
        block.textContent = "x";
        block.style.pointerEvents = "none";
        select();
        win(); // Check if player has won

        //  check if the game hasn't ended and the bot should make a move
        if (
          document.getElementById("heading").textContent === "tic-tac-toe" &&
          arrEmpty.length > 0
        ) {
          smartMove();
        }
      }
    });
  });

  const reset = () => {
    arr = Array(9).fill(" ");
    arrEmpty = [];
    document.getElementById("heading").textContent = "tic-tac-toe";
    document.body.style.background = "#f6b4ff86";
    document.querySelectorAll(".block").forEach((block) => {
      block.textContent = " ";
      block.style.pointerEvents = "auto";
    });
  };

  reset();

  document.getElementById("reset").addEventListener("click", reset);
});
