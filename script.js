var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context; 

// Snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];
var snakeColor = "lime";

// Food
var foodX;
var foodY;
var foodColor;

var gameOver = false;
var score = 0;

// Audio
var eatSound = new Audio('eat.mp3');
var gameOverSound = new Audio('gameover.mp3');

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
    
    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 100);
    
    createRestartButton();
}

function update() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw food
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Check if snake eats food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        snakeColor = foodColor; // Change snake color to food color
        score += 10;
        eatSound.play();
        placeFood();
    }

    // Move body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Move head
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // Draw snake
    context.fillStyle = snakeColor;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Game over conditions
    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        gameOver = true;
        gameOverSound.play();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            gameOverSound.play();
        }
    }

    // Display score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 20);
}

function displayGameOver() {
    context.fillStyle = "red";
    context.font = "30px Arial";
    context.fillText("Game Over", board.width / 2 - 80, board.height / 2);
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
    foodColor = getRandomColor();
}

function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createRestartButton() {
    let restartBtn = document.createElement("button");
    restartBtn.innerHTML = "Restart";
    restartBtn.style.display = "block";
    restartBtn.style.margin = "20px auto";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.fontSize = "18px";
    restartBtn.style.backgroundColor = "#4CAF50";
    restartBtn.style.color = "white";
    restartBtn.style.border = "none";
    restartBtn.style.borderRadius = "5px";
    restartBtn.style.cursor = "pointer";
    restartBtn.onmouseover = function() { restartBtn.style.backgroundColor = "#45a049"; };
    restartBtn.onmouseout = function() { restartBtn.style.backgroundColor = "#4CAF50"; };
    restartBtn.onclick = restartGame;
    
    let container = document.createElement("div");
    container.style.textAlign = "center";
    container.appendChild(restartBtn);
    document.body.appendChild(container);
}

function restartGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    snakeColor = "lime";
    gameOver = false;
    score = 0;
    placeFood();
    
    // Ensure the game starts running again immediately
    requestAnimationFrame(update);
}
