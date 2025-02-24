const tiles = [];
let yourScore = document.getElementById('yourScore');
let aiScore = document.getElementById('aiScore');
const confirmBox = document.getElementById("confirmReset");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

yourScore.innerText = localStorage.getItem('yourScore') || 0;
aiScore.innerText = localStorage.getItem('aiScore') || 0;

for (let i = 1; i <= 9; i++) {
    tiles[i] = document.getElementById(`box${i}`);
}

let playerTurn = true; 

document.getElementById('ovBox').addEventListener('click', (e) => {
    if (!playerTurn) return; 

    for (let i = 1; i <= 9; i++) {
        if (e.target === tiles[i] && tiles[i].innerHTML !== 'X' && tiles[i].innerHTML !== 'O') {
            tiles[i].innerHTML = 'X';
            playerTurn = false;

            if (checkWin('X')) {
                setTimeout(() => {
                    alert("X Wins!");
                    gainScore('X');
                    resetBoard();
                }, 200);
                return;
            }

            let fullBoard = true;
            for (let j = 1; j <= 9; j++) {
                if (tiles[j].innerHTML !== 'X' && tiles[j].innerHTML !== 'O') {
                    fullBoard = false;
                }
            }

            setTimeout(() => {
                if (!fullBoard) {
                    let tileR = Math.floor(Math.random() * 9) + 1;
                    while (tiles[tileR].innerHTML === 'X' || tiles[tileR].innerHTML === 'O') {
                        tileR = Math.floor(Math.random() * 9) + 1;
                    }
                    tiles[tileR].innerHTML = 'O';

                    if (checkWin('O')) {
                        setTimeout(() => {
                            alert("O Wins!");
                            gainScore('O');
                            resetBoard();
                        }, 200);
                        return;
                    }

                    playerTurn = true; 
                } else {
                    alert("It's a Draw!");
                    resetBoard();
                }
            }, 500);
        }
    }
});

const checkWin = (player) => { 
    const winningCombos = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], 
        [1, 4, 7], [2, 5, 8], [3, 6, 9],  
        [1, 5, 9], [3, 5, 7]              
    ];

    return winningCombos.some(combo => 
        tiles[combo[0]].innerHTML === player &&
        tiles[combo[1]].innerHTML === player &&
        tiles[combo[2]].innerHTML === player
    );
}

const resetBoard = () => {
    for (let i = 1; i <= 9; i++) {
        tiles[i].innerHTML = '';
    }
    playerTurn = true;
}

const gainScore = (player) => {
    try {
        if (player === 'X') {
            let newScore = parseInt(yourScore.innerText) + 1;
            yourScore.innerText = newScore;
            localStorage.setItem('yourScore', newScore); 
        } else {
            let newScore = parseInt(aiScore.innerText) + 1;
            aiScore.innerText = newScore;
            localStorage.setItem('aiScore', newScore);  
        }
    } catch (e) {
        console.log(e);
    }
}

const resetScore = () => {
    yourScore.innerText = 0;
    aiScore.innerText = 0;
    localStorage.setItem('yourScore', 0);
    localStorage.setItem('aiScore', 0);
}

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
