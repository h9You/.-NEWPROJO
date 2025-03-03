document.addEventListener("DOMContentLoaded", () => {
    const difficulty = localStorage.getItem('memoryGameDifficulty') || 'medium';
    
    let gridColumns, cardCount;
    switch(difficulty) {
        case 'easy':
            gridColumns = 3;
            cardCount = 12;
            break;
        case 'hard':
            gridColumns = 5;
            cardCount = 20;
            break;
        case 'medium':
        default:
            gridColumns = 4;
            cardCount = 16;
            break;
    }
    
    const allEmojis = [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁",
        "🐯", "🦄", "🦓", "🦒", "🐘", "🦏", "🦔", "🐿️", "🦇", "🐢"
    ];
    
    let selectedEmojis = allEmojis.slice(0, cardCount/2);
    let gameEmojis = [...selectedEmojis, ...selectedEmojis];
    
    const container = document.createElement("div");
    container.classList.add("game-container");
    document.body.appendChild(container);
    
    const header = document.createElement("div");
    header.classList.add("game-header");
    container.appendChild(header);
    
    const gameInfo = document.createElement("div");
    gameInfo.classList.add("game-info");
    header.appendChild(gameInfo);
    
    const difficultyDisplay = document.createElement("div");
    difficultyDisplay.classList.add("difficulty");
    difficultyDisplay.innerHTML = `Difficulty: <span>${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>`;
    gameInfo.appendChild(difficultyDisplay);
    
    const timerDisplay = document.createElement("div");
    timerDisplay.classList.add("timer");
    timerDisplay.innerText = "Time: 0s";
    gameInfo.appendChild(timerDisplay);
    
    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    container.appendChild(grid);
    
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    container.appendChild(buttonContainer);
    
    const homeBtn = document.createElement("button");
    homeBtn.innerText = "Home";
    homeBtn.classList.add("home-btn");
    buttonContainer.appendChild(homeBtn);
    
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.classList.add("restart-btn");
    buttonContainer.appendChild(restartBtn);
    
    const winPopup = document.createElement("div");
    winPopup.classList.add("win-popup");
    winPopup.style.display = "none";
    document.body.appendChild(winPopup);
    
    let shuffledImages = [...gameEmojis].sort(() => 0.5 - Math.random());
    let firstCard, secondCard;
    let lockBoard = false;
    let matches = 0;
    let time = 0;
    let timer;
    let cards = [];
    
    const startTimer = () => {
        timer = setInterval(() => {
            time++;
            timerDisplay.innerText = `Time: ${time}s`;
        }, 1000);
    };
    
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
            if (lockBoard || this === firstCard) return;
            
            this.classList.add("flipped");
            
            if (!firstCard) {
                firstCard = this;
                return;
            }
            
            secondCard = this;
            lockBoard = true;
            
            checkForMatch();
        });
    });
    
    const checkForMatch = () => {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            setTimeout(() => {
                firstCard.classList.add("matched", "jump");
                secondCard.classList.add("matched", "jump");
                
                firstCard.querySelector(".back").classList.add("matched");
                secondCard.querySelector(".back").classList.add("matched");
                
                firstCard.removeEventListener("click", flipCard);
                secondCard.removeEventListener("click", flipCard);
                
                matches++;
                firstCard = secondCard = null;
                lockBoard = false;
                
                if (matches === gameEmojis.length / 2) {
                    gameWon();
                }
            }, 300);
            
            setTimeout(() => {
                const matchedCards = document.querySelectorAll(".card.jump");
                matchedCards.forEach(card => card.classList.remove("jump"));
            }, 800);
        } else {
            setTimeout(() => {
                firstCard.classList.add("shake");
                secondCard.classList.add("shake");
                
                setTimeout(() => {
                    firstCard.classList.remove("flipped", "shake");
                    secondCard.classList.remove("flipped", "shake");
                    firstCard = secondCard = null;
                    lockBoard = false;
                }, 500);
            }, 500);
        }
    };
    
    const gameWon = () => {
        clearInterval(timer);
        
        setTimeout(() => {
            winPopup.innerHTML = `
                <div class="win-content">
                    <h2>Congratulations!</h2>
                    <p class="win-stats">Time: ${time}s</p>
                    
                    <div class="win-buttons">
                        <button class="play-again">Play Again</button>
                        <button class="back-home">Home</button>
                    </div>
                </div>`;
            
            winPopup.style.display = "flex";
            
            winPopup.querySelector(".play-again").addEventListener("click", () => {
                location.reload();
            });
            
            winPopup.querySelector(".back-home").addEventListener("click", () => {
                window.location.href = "index.html";
            });
        }, 500);
    };
    
    homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    
    restartBtn.addEventListener("click", () => {
        location.reload();
    });
    
    startTimer();
});