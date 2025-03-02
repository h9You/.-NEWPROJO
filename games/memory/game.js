document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    container.classList.add("game-container");
    document.body.appendChild(container);

    const timerDisplay = document.createElement("div");
    timerDisplay.classList.add("timer");
    timerDisplay.innerText = "Time: 0s";
    container.appendChild(timerDisplay);

    const grid = document.createElement("div");
    grid.classList.add("grid");
    container.appendChild(grid);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    container.appendChild(buttonContainer);

    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.classList.add("restart-btn");
    buttonContainer.appendChild(restartBtn);

    const autoWinBtn = document.createElement("button");
    autoWinBtn.innerText = "Auto Win";
    autoWinBtn.classList.add("auto-win-btn");
    buttonContainer.appendChild(autoWinBtn);

    const winPopup = document.createElement("div");
    winPopup.classList.add("win-popup");
    winPopup.style.display = "none"; // Hide at start
    winPopup.innerHTML = `<p class="win-text">You Win!</p><button class="play-again">Play Again</button>`;
    document.body.appendChild(winPopup);

    const playAgainBtn = winPopup.querySelector(".play-again");

    const images = [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"
    ];

    let shuffledImages = [...images].sort(() => 0.5 - Math.random());
    let firstCard, secondCard;
    let lockBoard = false;
    let matches = 0;
    let time = 0;
    let timer;
    let cards = [];

    function startTimer() {
        timer = setInterval(() => {
            time++;
            timerDisplay.innerText = `Time: ${time}s`;
        }, 1000);
    }

    shuffledImages.forEach((emoji) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;

        const front = document.createElement("div");
        front.classList.add("front");

        const back = document.createElement("div");
        back.classList.add("back");
        back.innerText = emoji;

        card.appendChild(front);
        card.appendChild(back);
        grid.appendChild(card);
        cards.push(card);

        card.addEventListener("click", () => {
            if (lockBoard || card === firstCard) return;
            card.classList.add("flipped");

            if (!firstCard) {
                firstCard = card;
                return;
            }

            secondCard = card;
            lockBoard = true;

            if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                setTimeout(() => {
                    firstCard.classList.add("matched", "jump");
                    secondCard.classList.add("matched", "jump");

                    firstCard.querySelector(".back").classList.add("matched");
                    secondCard.querySelector(".back").classList.add("matched");
                }, 200);

                setTimeout(() => {
                    firstCard.classList.remove("jump");
                    secondCard.classList.remove("jump");
                }, 700);

                matches++;
                firstCard = secondCard = null;
                lockBoard = false;

                if (matches === images.length / 2) {
                    clearInterval(timer);
                    setTimeout(() => {
                        winPopup.style.display = "flex";
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove("flipped");
                    secondCard.classList.remove("flipped");
                    firstCard = secondCard = null;
                    lockBoard = false;
                }, 1000);
            }
        });
    });

    restartBtn.addEventListener("click", () => location.reload());
    playAgainBtn.addEventListener("click", () => location.reload());

    autoWinBtn.addEventListener("click", () => {
        clearInterval(timer);
        cards.forEach((card) => {
            card.classList.add("flipped", "matched", "jump");
            card.querySelector(".back").classList.add("matched");
        });

        setTimeout(() => {
            winPopup.style.display = "flex";
        }, 1000);
    });

    startTimer();
});
