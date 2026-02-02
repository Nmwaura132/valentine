// ============================================
// VALENTINE'S PROPOSAL - Interactive Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const introScreen = document.getElementById('introScreen');
    const memoryScreen = document.getElementById('memoryScreen');
    const gameScreen = document.getElementById('gameScreen');
    const questionScreen = document.getElementById('questionScreen');
    const successScreen = document.getElementById('successScreen');

    const startBtn = document.getElementById('startBtn');
    const nextBtn = document.getElementById('nextBtn');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    const heartsContainer = document.getElementById('heartsContainer');
    const confettiContainer = document.getElementById('confettiContainer');
    const escapeHint = document.getElementById('escapeHint');

    // Game elements
    const gameArea = document.getElementById('gameArea');
    const scoreValue = document.getElementById('scoreValue');
    const progressFill = document.getElementById('progressFill');

    // Game state
    let gameScore = 0;
    const targetScore = 10;
    let gameInterval = null;
    let gameActive = false;

    // Track escape attempts
    let escapeAttempts = 0;
    const noButtonMessages = [
        "Nice try! 😏",
        "Not so fast...",
        "Seriously?!",
        "Come on...",
        "Just say YES!",
        "I'm not giving up!",
        "🥺 Please?",
        "You know you want to!",
        "Last chance...",
        "Fine, I'll just follow you forever 💕"
    ];

    // ============================================
    // FLOATING HEARTS BACKGROUND
    // ============================================

    function createFloatingHearts() {
        const hearts = ['💕', '💖', '💗', '💓', '❤️', '💘', '💝'];

        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (5 + Math.random() * 5) + 's';
            heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
            heartsContainer.appendChild(heart);

            // Clean up after animation
            setTimeout(() => heart.remove(), 10000);
        }, 500);
    }

    // Start floating hearts
    createFloatingHearts();

    // ============================================
    // SCREEN TRANSITIONS
    // ============================================

    function switchScreen(fromScreen, toScreen) {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
    }

    // Start button -> Memory screen
    startBtn.addEventListener('click', () => {
        switchScreen(introScreen, memoryScreen);
        animateMemoryCards();
    });

    // Next button -> Game screen
    nextBtn.addEventListener('click', () => {
        switchScreen(memoryScreen, gameScreen);
        startGame();
    });

    // ============================================
    // MEMORY CARDS ANIMATION
    // ============================================

    function animateMemoryCards() {
        const cards = document.querySelectorAll('.memory-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 200);
        });
    }

    // ============================================
    // CATCH THE HEARTS GAME
    // ============================================

    function startGame() {
        gameScore = 0;
        gameActive = true;
        updateScore();

        // Spawn hearts at intervals
        gameInterval = setInterval(() => {
            if (gameActive) {
                spawnGameHeart();
            }
        }, 600);
    }

    function spawnGameHeart() {
        const hearts = ['💖', '💕', '💗', '💓', '❤️', '💘', '💝', '🩷'];
        const heart = document.createElement('div');
        heart.className = 'game-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        // Random horizontal position
        const areaWidth = gameArea.offsetWidth;
        const maxLeft = areaWidth - 50;
        heart.style.left = (Math.random() * maxLeft) + 'px';

        // Random fall duration (speed)
        const duration = 2 + Math.random() * 2;
        heart.style.animationDuration = duration + 's';

        // Click/tap to catch
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            catchHeart(heart);
        });

        heart.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            catchHeart(heart);
        }, { passive: false });

        gameArea.appendChild(heart);

        // Remove heart after it falls
        setTimeout(() => {
            if (heart.parentNode && !heart.classList.contains('caught')) {
                heart.remove();
            }
        }, duration * 1000);
    }

    function catchHeart(heart) {
        if (heart.classList.contains('caught') || !gameActive) return;

        heart.classList.add('caught');
        gameScore++;
        updateScore();

        // Create a "+1" popup
        const popup = document.createElement('div');
        popup.textContent = '+1 💖';
        popup.style.cssText = `
            position: absolute;
            left: ${heart.offsetLeft}px;
            top: ${heart.offsetTop}px;
            color: #ff6b9d;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            animation: floatUp 0.8s ease-out forwards;
            z-index: 100;
        `;
        gameArea.appendChild(popup);

        setTimeout(() => popup.remove(), 800);
        setTimeout(() => heart.remove(), 300);

        // Check for win
        if (gameScore >= targetScore) {
            winGame();
        }
    }

    function updateScore() {
        scoreValue.textContent = gameScore;
        const progress = (gameScore / targetScore) * 100;
        progressFill.style.width = progress + '%';
    }

    function winGame() {
        gameActive = false;
        clearInterval(gameInterval);

        // Clear remaining hearts
        gameArea.querySelectorAll('.game-heart').forEach(h => h.remove());

        // Show completion message
        const complete = document.createElement('div');
        complete.className = 'game-complete';
        complete.innerHTML = `
            <div class="game-complete-text">You caught all my love! 💕</div>
            <button class="btn btn-primary pulse" id="continueBtn">See Your Surprise ✨</button>
        `;
        gameArea.appendChild(complete);

        // Continue to question
        document.getElementById('continueBtn').addEventListener('click', () => {
            switchScreen(gameScreen, questionScreen);
        });
    }

    // Add CSS animation for popup
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-50px); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // THE PLAYFUL "NO" BUTTON
    // ============================================

    function getRandomPosition() {
        const btnRect = noBtn.getBoundingClientRect();

        // Calculate bounds
        const maxX = window.innerWidth - btnRect.width - 20;
        const maxY = window.innerHeight - btnRect.height - 20;

        return {
            x: Math.max(20, Math.random() * maxX),
            y: Math.max(20, Math.random() * maxY)
        };
    }

    function escapeNoButton() {
        escapeAttempts++;

        // Make button escape
        const pos = getRandomPosition();
        noBtn.style.position = 'fixed';
        noBtn.style.left = pos.x + 'px';
        noBtn.style.top = pos.y + 'px';
        noBtn.style.zIndex = '1000';
        noBtn.style.transition = 'all 0.2s ease';

        // Update hint message
        if (escapeAttempts <= noButtonMessages.length) {
            escapeHint.textContent = noButtonMessages[escapeAttempts - 1];
            escapeHint.style.color = 'rgba(255, 255, 255, 0.7)';
        }

        // Shrink button after many attempts
        if (escapeAttempts > 5) {
            const shrinkFactor = Math.max(0.5, 1 - (escapeAttempts - 5) * 0.1);
            noBtn.style.transform = `scale(${shrinkFactor})`;
        }

        // Make YES button grow
        const yesScale = 1 + (escapeAttempts * 0.05);
        yesBtn.style.transform = `scale(${Math.min(yesScale, 1.5)})`;
    }

    // Escape on hover and click
    noBtn.addEventListener('mouseenter', escapeNoButton);
    noBtn.addEventListener('click', escapeNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        escapeNoButton();
    });

    // ============================================
    // YES BUTTON - THE CELEBRATION!
    // ============================================

    yesBtn.addEventListener('click', () => {
        switchScreen(questionScreen, successScreen);
        launchConfetti();
        createHeartExplosion();
    });

    // ============================================
    // CONFETTI & CELEBRATION
    // ============================================

    function launchConfetti() {
        const colors = ['#ff6b9d', '#ffd6e0', '#a855f7', '#22c55e', '#ffd700', '#ff4444'];
        const shapes = ['square', 'circle'];

        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';

                // Random properties
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * 10 + 5;

                confetti.style.backgroundColor = color;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-20px';
                confetti.style.borderRadius = shape === 'circle' ? '50%' : '2px';
                confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
                confetti.style.animationDelay = (Math.random() * 0.5) + 's';

                confettiContainer.appendChild(confetti);

                // Clean up
                setTimeout(() => confetti.remove(), 5000);
            }, i * 20);
        }
    }

    function createHeartExplosion() {
        const hearts = ['💕', '💖', '💗', '💓', '❤️', '💘', '💝', '🎉', '✨'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = '50%';
                heart.style.top = '50%';
                heart.style.fontSize = (2 + Math.random() * 2) + 'rem';
                heart.style.opacity = '1';
                heart.style.animation = 'none';

                // Explode in random direction
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 200;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;

                heart.style.transition = 'all 1s ease-out';
                heartsContainer.appendChild(heart);

                requestAnimationFrame(() => {
                    heart.style.transform = `translate(${endX}px, ${endY}px) scale(0)`;
                    heart.style.opacity = '0';
                });

                setTimeout(() => heart.remove(), 1500);
            }, i * 50);
        }
    }
});
