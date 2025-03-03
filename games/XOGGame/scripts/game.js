document.addEventListener('DOMContentLoaded', () => {
    const tiles = [];
    const yourScore = document.getElementById('yourScore');
    const aiScore = document.getElementById('aiScore');
    const confirmBox = document.getElementById("confirmReset");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");
    const turnIndicator = document.getElementById("turnIndicator");
    
    const playerSymbol = localStorage.getItem('playerSymbol') || 'X';
    const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
    
    yourScore.innerText = localStorage.getItem('yourScore') || 0;
    aiScore.innerText = localStorage.getItem('aiScore') || 0;
    
    for (let i = 1; i <= 9; i++) {
        tiles[i] = document.getElementById(`box${i}`);
    }
    
    let playerTurn = true;
    let gameActive = true;
    
    const updateTurnIndicator = () => {
        if (!gameActive) return;
        
        turnIndicator.textContent = playerTurn ? "Your turn" : "AI thinking...";
        turnIndicator.style.backgroundColor = playerTurn ? 
            "rgba(0, 198, 255, 0.2)" : "rgba(255, 161, 8, 0.2)";
    };
    
    updateTurnIndicator();
    
    const addMark = (tile, symbol) => {
        tile.innerHTML = symbol;
        tile.classList.add(symbol === 'X' ? 'X-mark' : 'O-mark');
        tile.setAttribute('data-animation', 'appear');
        
        setTimeout(() => {
            tile.removeAttribute('data-animation');
        }, 400);
    };
    
    const highlightWinningTiles = (combo) => {
        combo.forEach(index => {
            tiles[index].classList.add('win');
        });
    };
    
    const checkWin = (player) => {
        const winningCombos = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9], 
            [1, 5, 9], [3, 5, 7]            
        ];
        
        for (const combo of winningCombos) {
            if (tiles[combo[0]].innerHTML === player &&
                tiles[combo[1]].innerHTML === player &&
                tiles[combo[2]].innerHTML === player) {
                    
                highlightWinningTiles(combo);
                return true;
            }
        }
        
        return false;
    };
    
    const resetBoard = () => {
        for (let i = 1; i <= 9; i++) {
            tiles[i].innerHTML = '';
            tiles[i].classList.remove('X-mark', 'O-mark', 'win');
        }
        gameActive = true;
        playerTurn = true;
        updateTurnIndicator();
    };
    
    const gainScore = (winner) => {
        try {
            if ((winner === playerSymbol)) {
                let newScore = parseInt(yourScore.innerText) + 1;
                yourScore.innerText = newScore;
                localStorage.setItem('yourScore', newScore);
            } else {
                let newScore = parseInt(aiScore.innerText) + 1;
                aiScore.innerText = newScore;
                localStorage.setItem('aiScore', newScore);
            }
        } catch (e) {
            console.error("Error updating score:", e);
        }
    };
    
    const resetScore = () => {
        yourScore.innerText = 0;
        aiScore.innerText = 0;
        localStorage.setItem('yourScore', 0);
        localStorage.setItem('aiScore', 0);
    };
    
    const makeAiMove = () => {
        if (!gameActive) return;
        
        updateTurnIndicator();
        
        setTimeout(() => {
            for (let i = 1; i <= 9; i++) {
                if (tiles[i].innerHTML === '') {
                    tiles[i].innerHTML = aiSymbol;
                    if (checkWin(aiSymbol)) {
                        addMark(tiles[i], aiSymbol);
                        gameActive = false;
                        turnIndicator.textContent = "AI wins!";
                        turnIndicator.style.backgroundColor = "rgba(255, 161, 8, 0.3)";
                        
                        setTimeout(() => {
                            alert("AI Wins!");
                            gainScore(aiSymbol);
                            resetBoard();
                        }, 500);
                        return;
                    }
                    tiles[i].innerHTML = '';
                }
            }
            
            for (let i = 1; i <= 9; i++) {
                if (tiles[i].innerHTML === '') {
                    tiles[i].innerHTML = playerSymbol;
                    if (checkWin(playerSymbol)) {
                        tiles[i].innerHTML = '';
                        addMark(tiles[i], aiSymbol);
                        playerTurn = true;
                        updateTurnIndicator();
                        return;
                    }
                    tiles[i].innerHTML = '';
                }
            }
            
            if (tiles[5].innerHTML === '') {
                addMark(tiles[5], aiSymbol);
                playerTurn = true;
                updateTurnIndicator();
                return;
            }
            
            const corners = [1, 3, 7, 9];
            const availableCorners = corners.filter(i => tiles[i].innerHTML === '');
            
            if (availableCorners.length > 0) {
                const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
                addMark(tiles[randomCorner], aiSymbol);
                playerTurn = true;
                updateTurnIndicator();
                return;
            }
            
            const availableTiles = [];
            for (let i = 1; i <= 9; i++) {
                if (tiles[i].innerHTML === '') {
                    availableTiles.push(i);
                }
            }
            
            if (availableTiles.length > 0) {
                const randomTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
                addMark(tiles[randomTile], aiSymbol);
                playerTurn = true;
                updateTurnIndicator();
            } else {
                turnIndicator.textContent = "It's a draw!";
                turnIndicator.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                
                setTimeout(() => {
                    alert("It's a Draw!");
                    resetBoard();
                }, 500);
            }
            
        }, 700);
    };
    
    document.getElementById('ovBox').addEventListener('click', (e) => {
        if (!gameActive || !playerTurn) return;
        
        for (let i = 1; i <= 9; i++) {
            if (e.target === tiles[i] && tiles[i].innerHTML === '') {
                addMark(tiles[i], playerSymbol);
                
                if (checkWin(playerSymbol)) {
                    gameActive = false;
                    turnIndicator.textContent = "You win!";
                    turnIndicator.style.backgroundColor = "rgba(0, 198, 255, 0.3)";
                    
                    setTimeout(() => {
                        alert("You Win!");
                        gainScore(playerSymbol);
                        resetBoard();
                    }, 500);
                    return;
                }
                
                let fullBoard = true;
                for (let j = 1; j <= 9; j++) {
                    if (tiles[j].innerHTML === '') {
                        fullBoard = false;
                        break;
                    }
                }
                
                if (fullBoard) {
                    turnIndicator.textContent = "It's a draw!";
                    turnIndicator.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                    
                    setTimeout(() => {
                        alert("It's a Draw!");
                        resetBoard();
                    }, 500);
                    return;
                }
                
                playerTurn = false;
                updateTurnIndicator();
                makeAiMove();
                break;
            }
        }
    });
    
    document.getElementById('reset').addEventListener('click', () => {
        confirmBox.style.display = "block";
    });
    
    confirmYes.addEventListener('click', () => {
        resetBoard();
        resetScore();
        confirmBox.style.display = "none";
    });
    
    confirmNo.addEventListener('click', () => {
        confirmBox.style.display = "none";
    });
});