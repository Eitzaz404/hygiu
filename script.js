const gameArea = document.getElementById('gameArea');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const missesSpan = document.getElementById('misses');
const startBtn = document.getElementById('startBtn');
const messageDiv = document.getElementById('message');

let score = 0;
let misses = 0;
let timeLeft = 30;
let gameActive = false;
let targetInterval = null;
let countdownInterval = null;
let currentTarget = null;

// Spawn a new target at random position
function spawnTarget() {
    if (!gameActive) return;
    
    // Remove existing target if any
    if (currentTarget) {
        currentTarget.remove();
        // If missed (target disappeared without click), count as miss
        if (gameActive) {
            misses++;
            missesSpan.textContent = misses;
            checkMissLimit();
        }
    }
    
    const target = document.createElement('div');
    target.classList.add('target');
    
    // Random position within gameArea (considering target size)
    const maxX = gameArea.clientWidth - 60;
    const maxY = gameArea.clientHeight - 60;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    
    target.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!gameActive) return;
        // Successful click
        score += 10;
        scoreSpan.textContent = score;
        target.remove();
        currentTarget = null;
        // Spawn next immediately
        if (gameActive) {
            clearTimeout(targetTimeout);
            spawnTarget();
        }
    });
    
    gameArea.appendChild(target);
    currentTarget = target;
    
    // Auto-remove after 1.5 seconds if not clicked
    targetTimeout = setTimeout(() => {
        if (currentTarget === target && gameActive) {
            target.remove();
            currentTarget = null;
            misses++;
            missesSpan.textContent = misses;
            checkMissLimit();
            if (gameActive) spawnTarget();
        }
    }, 1500);
}

let targetTimeout;

function checkMissLimit() {
    if (misses >= 10) {
        endGame("Game Over! Too many misses.");
    }
}

function startGame() {
    if (gameActive) return;
    resetGame();
    gameActive = true;
    startBtn.disabled = true;
    messageDiv.textContent = "";
    
    // Start timer
    countdownInterval = setInterval(() => {
        if (!gameActive) return;
        if (timeLeft <= 0) {
            endGame("Time's up! Game finished.");
        } else {
            timeLeft--;
            timerSpan.textContent = timeLeft;
        }
    }, 1000);
    
    // Spawn first target
    spawnTarget();
}

function endGame(reason) {
    gameActive = false;
    clearInterval(countdownInterval);
    clearTimeout(targetTimeout);
    if (currentTarget) currentTarget.remove();
    currentTarget = null;
    startBtn.disabled = false;
    messageDiv.textContent = `${reason} Your score: ${score}`;
}

function resetGame() {
    score = 0;
    misses = 0;
    timeLeft = 30;
    scoreSpan.textContent = "0";
    missesSpan.textContent = "0";
    timerSpan.textContent = "30";
    if (currentTarget) currentTarget.remove();
    currentTarget = null;
    if (targetInterval) clearInterval(targetInterval);
    if (countdownInterval) clearInterval(countdownInterval);
    gameActive = false;
}

startBtn.addEventListener('click', startGame);

// Ensure game area size is known when spawning
window.addEventListener('resize', () => {
    // If game active, reposition target? Not necessary, but to avoid out-of-bounds we could.
    // For simplicity, we just reset if active? Better to just ignore.
});
