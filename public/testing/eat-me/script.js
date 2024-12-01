const player1 = document.getElementById('player1');
const counter = document.getElementById('counting');

let score = 0;
let counting = 60;

setInterval(() => {
    if (counting > 0) {
        counting -= 1;
    }
    counter.textContent = counting;

    // Start moving blocks towards player1 when counter reaches 0
    if (counting === 0) {
        moveBlocksTowardsPlayer();
    }
}, 1000);

function followMouse() {
    const randomNumber = Math.floor(Math.random() * (30 - 20 + 1) + 20);

    // Create multiple blocks
    function randomBlocks() {
        for (let i = 0; i < randomNumber; i++) {
            const randomSize = Math.floor(Math.random() * (30 - 10 + 1) + 10);

            const randomPositionX = Math.floor(Math.random() * (window.innerWidth - randomSize));
            const randomPositionY = Math.floor(Math.random() * (window.innerHeight - randomSize));

            const block = document.createElement('div');

            block.className = 'blocks';
            block.style.width = `${randomSize}px`;
            block.style.height = `${randomSize}px`;
            block.style.background = 'red';
            block.style.position = 'absolute';
            block.style.left = `${randomPositionX}px`;
            block.style.top = `${randomPositionY}px`;

            document.body.appendChild(block);
        }
    }
    randomBlocks();

    // Set styles for player1
    player1.style.width = '30px';
    player1.style.height = '30px';
    player1.style.background = 'white'
    player1.style.backgroundImage = 'url("../../../../public/stefan.png")';
    player1.style.backgroundPosition = 'cover'
    player1.style.position = 'absolute';

    // Create score display and append it to player1
    const scoreText = document.createElement('p');
    player1.appendChild(scoreText);
    scoreText.textContent = ` ${score}`;
    scoreText.style.position = 'absolute';

    // Add mousemove event listener
    document.addEventListener('mousemove', (e) => {
        player1.style.top = `${e.clientY}px`;
        player1.style.left = `${e.clientX}px`;

        const player1Pos = player1.getBoundingClientRect();

        // Check for collision with each block
        const blocks = document.querySelectorAll('.blocks');
        blocks.forEach(block => {
            const blockPos = block.getBoundingClientRect();

            // Collision detection logic
            if (
                player1Pos.left < blockPos.right &&
                player1Pos.right > blockPos.left &&
                player1Pos.top < blockPos.bottom &&
                player1Pos.bottom > blockPos.top
            ) {
                score++;
                scoreText.textContent = ` ${score}`;

                const currentWidth = parseInt(player1.style.width) || 0;
                const currentHeight = parseInt(player1.style.height) || 0;

                player1.style.width = `${currentWidth + blockPos.width}px`;
                player1.style.height = `${currentHeight + blockPos.height}px`;
                player1.style.transition = `0.5s width, 0.5s height`;

                block.remove();

                const checkBlocks = document.querySelectorAll('.blocks');
                if (checkBlocks.length === 0 && counting > 0) {
                    player1.style.width = '30px';
                    player1.style.height = '30px';
                    setTimeout(() => {
                        randomBlocks();
                    }, 500);
                }
            }
        });
    });
}

// Function to move blocks towards player1 when counter is 0
function moveBlocksTowardsPlayer() {
    const blocks = document.querySelectorAll('.blocks');
    const player1Pos = player1.getBoundingClientRect();

    blocks.forEach(block => {
        const blockPos = block.getBoundingClientRect();

        const deltaX = player1Pos.left - blockPos.left;
        const deltaY = player1Pos.top - blockPos.top;

        const moveX = deltaX * 0.05;
        const moveY = deltaY * 0.05;

        block.style.left = `${blockPos.left + moveX}px`;
        block.style.top = `${blockPos.top + moveY}px`;
        block.style.transition = '0.1s';
    });

    // Continue moving blocks as long as the counter is 0
    if (counting === 0) {
        requestAnimationFrame(moveBlocksTowardsPlayer);
    }
}

followMouse();
