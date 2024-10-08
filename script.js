const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const replayBtn = document.getElementById('replayBtn');
const finalScore = document.getElementById('finalScore');

let gameState = 'start';  
let score = 0;

// Box dimensions
const boxWidth = canvas.width;
const boxHeight = canvas.height;

// Car dimensions and initial position
const carWidth = 10;
const carHeight = 20;
let carX = boxWidth / 2 - carWidth / 2; 
let carY = boxHeight / 2 - carHeight / 2; 
const carSpeed = 5;


// Ball properties
const ballRadius = 5;
let ballX = boxWidth / 2;
let ballY = boxHeight / 2;
let ballSpeedX = 0;
let ballSpeedY = 0;

// Goal post dimensions
const goalWidth = 100;
const goalHeight = 10;
const goalX = boxWidth / 2 - goalWidth / 2;
const goalY = 10; 

function drawCar() {
    ctx.fillStyle = 'blue'; 
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'red'; 
  ctx.fill();
  ctx.closePath();
}

function drawGoal() {
  ctx.fillStyle = 'green';
  ctx.fillRect(goalX, goalY, goalWidth, goalHeight);
}

function clearCanvas() {
    ctx.clearRect(0, 0, boxWidth, boxHeight);
}

function detectCollision() {
  const distX = Math.abs(ballX - (carX + carWidth / 2));
  const distY = Math.abs(ballY - (carY + carHeight / 2));

  if (distX < carWidth / 2 + ballRadius && distY < carHeight / 2 + ballRadius) {
      ballSpeedX = (ballX - carX) / 10;
      ballSpeedY = (ballY - carY) / 10;
  }
}



function moveCar(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (carY > 0) carY -= carSpeed;
            break;
        case 'ArrowDown':
            if (carY + carHeight < boxHeight) carY += carSpeed;
            break;
        case 'ArrowLeft':
            if (carX > 0) carX -= carSpeed;
            break;
        case 'ArrowRight':
            if (carX + carWidth < boxWidth) carX += carSpeed;
            break;
    }

    detectCollision(); 
    drawScene(); 
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  ballSpeedX *= 0.98;
  ballSpeedY *= 0.98;

   if (ballX - ballRadius < 0 || ballX + ballRadius > boxWidth) {
    gameOver();
}
if (ballY - ballRadius < 0 || ballY + ballRadius > boxHeight) {
    gameOver();
}
}

function checkGoal() {
  if (ballX > goalX && ballX < goalX + goalWidth && ballY - ballRadius < goalY + goalHeight) {
      score += 1;
      resetBall();
  }
}

function resetBall() {
  ballX = boxWidth / 2;
  ballY = boxHeight / 2;
  ballSpeedX = 0;
  ballSpeedY = 0;
}

function resetGame() {
  carX = boxWidth / 2 - carWidth / 2;
  carY = boxHeight - carHeight - 20;
  resetBall();
  score = 0;
}


function gameOver() {
  gameState = 'gameOver';
  finalScore.innerText = `Your score: ${score}`;
  gameOverScreen.style.display = 'flex';
}

function drawScene() {
  if (gameState === 'playing') {
  clearCanvas();
  drawGoal();
  drawCar();
  drawBall();
  moveBall();  
  checkGoal(); 
}
}

window.addEventListener('keydown', moveCar);

startBtn.addEventListener('click', () => {
  gameState = 'playing';
  startScreen.style.display = 'none';
  drawScene();
});

replayBtn.addEventListener('click', () => {
  gameState = 'playing';
  gameOverScreen.style.display = 'none';
  resetGame();
  drawScene();
});

drawScene();

setInterval(drawScene, 1000 / 60); 