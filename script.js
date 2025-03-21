const gameContainer = document.getElementById("game-container");
const block = document.getElementById("block");
const scoreDisplay = document.getElementById("score");
const recordDisplay = document.getElementById("record");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let record = localStorage.getItem("stackGameRecord") || 0;
let blockPosition = 0;
let blockSpeed = 2;
let blockDirection = 1;
let isPlaying = true;
let stack = [];

recordDisplay.textContent = Record: ${record};

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
        block.style.width = overlap + "px";
        blockPosition += (block.offsetWidth - overlap) / 2;
        block.style.left = blockPosition + "px";
        score++;
        scoreDisplay.textContent = Score: ${score};
        blockSpeed *= 1.1;

        const newBlock = block.cloneNode(true);
        newBlock.style.backgroundColor = getRandomColor();
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

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function endGame() {
    isPlaying = false;
    restartBtn.style.display = "block";

    if (score > record) {
        record = score;
        localStorage.setItem("stackGameRecord", record);
        recordDisplay.textContent = Record: ${record};
    }
}

function restartGame() {
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    block.style.width = "100px";
    blockPosition = Math.random() * (gameContainer.offsetWidth - 100);
    block.style.left = blockPosition + "px";
    blockSpeed = 2;
    blockDirection = 1;
    isPlaying = true;
    restartBtn.style.display = "none";

    stack.forEach(b => b.remove());
    stack = [];

    moveBlock();
}

gameContainer.addEventListener("click", dropBlock);
restartBtn.addEventListener("click", restartGame);

stack.push(block);
moveBlock();
