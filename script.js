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
const carWidth = 25;
const carHeight = 20;
let carX = boxWidth / 2 - carWidth / 2; 
let carY = boxHeight / 2 - carHeight / 2; 
const carSpeed = 5;

// Load multiple car images for animation
const carImages = [];
const numFrames = 4; 

for (let i = 1; i <= numFrames; i++) {
    const img = new Image();
    img.src = `image/car${i}.png`; 
    carImages.push(img);
}

let currentFrame = 0; 
let carVelocityX = 0;
let carVelocityY = 0;
const carAcceleration = 0.2; 
const carFriction = 0.05; 

function drawCar() {
  let angle = Math.atan2(carVelocityY, carVelocityX);

  ctx.save();

  ctx.translate(carX + carWidth / 2, carY + carHeight / 2);

  ctx.rotate(angle);

  ctx.drawImage(carImages[currentFrame], -carWidth / 2, -carHeight / 2, carWidth, carHeight);

  ctx.restore();
}

function updateCar() {
carX += carVelocityX;
carY += carVelocityY;

carVelocityX *= (1 - carFriction);
carVelocityY *= (1 - carFriction);

if (carX < 0) carX = 0;
if (carX + carWidth > boxWidth) carX = boxWidth - carWidth;
if (carY < 0) carY = 0;
if (carY + carHeight > boxHeight) carY = boxHeight - carHeight;
}

let smokeParticles = [];

function drawSmoke() {
  if (Math.abs(carVelocityX) > 0 || Math.abs(carVelocityY) > 0) {
      smokeParticles.push({
          x: carX + carWidth / 2,
          y: carY + carHeight,
          alpha: 1, 
          size: Math.random() * 5 + 5, 
      });
  }

  smokeParticles.forEach((particle, index) => {
      particle.y += 1; 
      particle.alpha -= 0.01; 

      ctx.globalAlpha = particle.alpha; // Set opacity
      ctx.fillStyle = 'rgba(100, 100, 100, 0.5)'; 
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      if (particle.alpha <= 0) {
          smokeParticles.splice(index, 1);
      }

      ctx.globalAlpha = 1;
  });
}

// Ball properties
const ballRadius = 5;
let ballX = boxWidth / 2;
let ballY = boxHeight / 2;
let ballSpeedX = 0;
let ballSpeedY = 0;

const ballImage = new Image();
ballImage.src = 'image/skull2.png'; 

function drawBall() {
  ctx.drawImage(ballImage, ballX, ballY, ballRadius * 2, ballRadius * 2);
}

function getRandomPosition(radius) {
    const x = Math.random() * (boxWidth - 2 * radius) + radius;
    const y = Math.random() * (boxHeight - 2 * radius) + radius;
    return { x, y };
}

function resetBall() {
    const ballPosition = getRandomPosition(ballRadius);
    ballX = ballPosition.x;
    ballY = ballPosition.y;
    ballSpeedX = 0;
      ballSpeedY = 0;
      ballDestroyed = false;
      ballRegenerationTimer = null;
        ballSpeedX = 0;
    ballSpeedY = 0;
}


// Bullets and flames
let bullets = [];
let flames = [];
const bulletSpeed = 4;
const flameSpeed = 3;
const bulletWidth = 5;
const bulletHeight = 10;
const flameWidth = 20;
const flameHeight = 10;
let ballDestroyed = false;
let ballRegenerationTimer = null;

function drawBullets() {
  ctx.fillStyle = 'black'; 
  bullets.forEach((bullet, index) => {
      ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
      bullet.y -= bulletSpeed;

      if (bullet.y < 0) {
          bullets.splice(index, 1);
      }

      if (!ballDestroyed && detectHit(bullet, ballX, ballY, ballRadius)) {
          destroyBall();
          bullets.splice(index, 1); 
      }
  });
}

const flameImage = new Image();
flameImage.src = 'image/flame.png';

function drawFlames() {
 
  flames.forEach((flame, index) => {
    ctx.drawImage(flameImage,flame.x, flame.y, flameWidth, flameHeight);

      flame.y -= flameSpeed;

      if (flame.y < 0) {
          flames.splice(index, 1);
      }

      if (!ballDestroyed && detectHit(flame, ballX, ballY, ballRadius)) {
          destroyBall();
          flames.splice(index, 1); 
      }
  });
}

function detectHit(projectile, ballX, ballY, ballRadius) {
  const distX = Math.abs(ballX - (projectile.x + bulletWidth / 2));
  const distY = Math.abs(ballY - (projectile.y + bulletHeight / 2));
  return distX < ballRadius && distY < ballRadius;
}

const blastImage = new Image();
blastImage.src = 'image/blast.png'; 

function drawBlast(x, y) {
  ctx.clearRect(x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
  
  ctx.drawImage(blastImage, x - ballRadius, y - ballRadius, ballRadius * 6, ballRadius * 6);
}

function destroyBall() {
  ballDestroyed = true;
  score += 1;

  const blastX = ballX;
  const blastY = ballY;

  drawBlast(blastX, blastY);

  ballRegenerationTimer = setTimeout(() => {
    resetBall();
  }, 800); 
}

function clearCanvas() {
    ctx.clearRect(0, 0, boxWidth, boxHeight);
}

function detectCollision() {
  const distX = Math.abs(ballX - (carX + carWidth / 2));
  const distY = Math.abs(ballY - (carY + carHeight / 2));

  if (distX < carWidth / 2 + ballRadius && distY < carHeight / 2 + ballRadius) {
      // Car hits the ball
      ballSpeedX = (ballX - carX) ;
      ballSpeedY = (ballY - carY) ;
  }
}

function moveCar(e) {
  if (gameState === 'playing') {
      switch (e.key) {
          case 'ArrowUp':
              carVelocityY -= carAcceleration;
              currentFrame = 2; 
              break;
          case 'ArrowDown':
              carVelocityY += carAcceleration;
              currentFrame = 2; 
              break;
          case 'ArrowLeft':
              carVelocityX -= carAcceleration;
              currentFrame = 3; 
              break;
          case 'ArrowRight':
              carVelocityX += carAcceleration;
              currentFrame = 1; 
              break;
          case 'b':
              fireBullet();
              break;
          case 'f':
              throwFlame();
              break;
          case 'q':
                gameOver();
                break;
      }

          detectCollision();
          drawScene();
      
  }
}

function fireBullet() {
  bullets.push({ x: carX + carWidth / 2 - bulletWidth / 2, y: carY });
}

function throwFlame() {
  flames.push({ x: carX + carWidth / 2 - flameWidth / 2, y: carY });
}

function moveBall() {
  if (!ballDestroyed) {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      ballSpeedX *= 0.98; 
      ballSpeedY *= 0.98;

       if (ballX - ballRadius < 0 || ballX + ballRadius > boxWidth) {
        ballSpeedX = -ballSpeedX;  
    }
    if (ballY - ballRadius < 0 || ballY + ballRadius > boxHeight) {
        ballSpeedY = -ballSpeedY; 
    }
  }
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
      drawSmoke(); 
      drawCar();
      drawBullets();
      drawFlames();
      moveBall();
      if (!ballDestroyed) {
          drawBall();
      }
      updateCar(); 
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