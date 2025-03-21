const gameContainer = document.getElementById("game-container");
const timerDisplay = document.getElementById("timer");
const colorSquare = document.getElementById("color-square");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const scoreDisplay = document.getElementById("score");
const recordDisplay = document.getElementById("record");
const startBtn = document.getElementById("start-btn");

let score = 0;
let record = localStorage.getItem("colorReactionRecord") || 0;
let timeLeft = 10;
let timerInterval;

recordDisplay.textContent = Record: ${record};

function startGame() {
    startBtn.style.display = "none";
    leftBtn.style.display = "block"; // Показуємо кнопки
    rightBtn.style.display = "block"; // Показуємо кнопки
    timerDisplay.style.display = "block";
    colorSquare.style.display = "block";

    score = 0;
    scoreDisplay.textContent = Score: ${score};
    timeLeft = 10;
    timerDisplay.textContent = timeLeft;

    generateColorSquare();
    startTimer();
}

function generateColorSquare() {
    const randomColor = Math.random() < 0.5 ? "red" : "blue";
    colorSquare.style.backgroundColor = randomColor;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft === 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    startBtn.style.display = "block";
    leftBtn.style.display = "none"; // Приховуємо кнопки
    rightBtn.style.display = "none"; // Приховуємо кнопки
    timerDisplay.style.display = "none";
    colorSquare.style.display = "none";

    if (score > record) {
        record = score;
        localStorage.setItem("colorReactionRecord", record);
        recordDisplay.textContent = Record: ${record};
    }
}

function checkAnswer(isLeft) {
    const isRed = colorSquare.style.backgroundColor === "red";

    if ((isLeft && isRed) || (!isLeft && !isRed)) {
        score++;
    } else {
        score--;
    }

    scoreDisplay.textContent = Score: ${score};
    generateColorSquare();
}

leftBtn.addEventListener("click", () => checkAnswer(true));
rightBtn.addEventListener("click", () => checkAnswer(false));
startBtn.addEventListener("click", startGame);

// Приховуємо елементи на початку гри
leftBtn.style.display = "none";
rightBtn.style.display = "none";
timerDisplay.style.display = "none";
colorSquare.style.display = "none";
