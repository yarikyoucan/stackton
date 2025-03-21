const gameContainer = document.getElementById("game-container");
const block = document.getElementById("block");
const scoreDisplay = document.getElementById("score");
const recordDisplay = document.getElementById("record");
const startBtn = document.getElementById("start-btn");

let score = 0;
let record = localStorage.getItem("stackGameRecord") || 0;
let blockPosition = 0;
let blockSpeed = 2;
let blockDirection = 1;
let isPlaying = false;
let stack = [];

recordDisplay.textContent = Record: ${record};

function startGame() {
    isPlaying = true;
    startBtn.style.display = "none";
    stack.push(block);
    moveBlock();
}

function moveBlock() {
    if (!isPlaying) return;

    blockPosition += blockSpeed * blockDirection;

    if (blockPosition < 0) {
        blockPosition = 0;
        blockDirection *= -1;
    } else if (blockPosition + block.offsetWidth > gameContainer.offsetWidth) {
        blockPosition = gameContainer.offsetWidth - block.offsetWidth;
        blockDirection *= -1;
    }

    block.style.left = blockPosition + "px";

    requestAnimationFrame(moveBlock);
}

function dropBlock() {
    if (!isPlaying) return;

    const prevBlock = stack[stack.length - 1];
    const overlap = prevBlock ? calculateOverlap(block, prevBlock) : block.offsetWidth;

    if (overlap > 0) {
        const blackPart = document.createElement("div");
        blackPart.classList.add("black-part");
        blackPart.style.left = blockPosition + overlap + "px";
        blackPart.style.width = block.offsetWidth - overlap + "px";
        blackPart.style.height = block.offsetHeight + "px";
        gameContainer.appendChild(blackPart);

        setTimeout(() => {
            blackPart.style.opacity = 0;
            setTimeout(() => {
                blackPart.remove();
            }, 500);
        }, 10);

        block.style.width = overlap + "px";
        blockPosition += (block.offsetWidth - overlap) / 2;
        block.style.left = blockPosition + "px";
        score++;
        scoreDisplay.textContent = Score: ${score};
        blockSpeed *= 1.1;

        const newBlock = block.cloneNode(true);
        newBlock.style.backgroundColor = getNextBlockColor();
        gameContainer.appendChild(newBlock);
        stack.push(newBlock);

        block.style.width = "100px";
        blockPosition = Math.random() * (gameContainer.offsetWidth - 100);
        block.style.left = blockPosition + "px";
    } else {
        endGame();
    }
}

function calculateOverlap(block1, block2) {
    const rect1 = block1.getBoundingClientRect();
    const rect2 = block2.getBoundingClientRect();

    const left = Math.max(rect1.left, rect2.left);
    const right = Math.min(rect1.right, rect2.right);

    return Math.max(0, right - left);
}

function getNextBlockColor() {
    const colors = ["darkgreen", "limegreen", "lightgreen", "mediumseagreen", "seagreen", "forestgreen", "green", "olive", "yellowgreen", "darkolivegreen"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function endGame() {
    isPlaying = false;
    startBtn.style.display = "block";

    if (score > record) {
        record = score;
        localStorage.setItem("stackGameRecord", record);
        recordDisplay.textContent = Record: ${record};
    }
}

gameContainer.addEventListener("click", dropBlock);
startBtn.addEventListener("click", startGame);

// Розташування початкового блоку по центру
block.style.left = (gameContainer.offsetWidth - block.offsetWidth) / 2 + "px";
