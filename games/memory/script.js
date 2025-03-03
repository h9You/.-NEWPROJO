document.addEventListener("DOMContentLoaded", () => {
    const mainMenu = document.getElementById("main-menu");
    const difficultyMenu = document.getElementById("difficulty-menu");
    const settingsMenu = document.getElementById("settings-menu");
    
    const playBtn = document.getElementById("play-btn");
    const settingsBtn = document.getElementById("settings-btn");
    
    const easyBtn = document.getElementById("easy-btn");
    const mediumBtn = document.getElementById("medium-btn");
    const hardBtn = document.getElementById("hard-btn");
    
    const backFromDifficulty = document.getElementById("back-from-difficulty");
    const backFromSettings = document.getElementById("back-from-settings");
    
    const showMenu = (menu) => {
        mainMenu.style.display = "none";
        difficultyMenu.style.display = "none";
        settingsMenu.style.display = "none";
        
        menu.style.display = "flex";
    };
    
    playBtn.addEventListener("click", () => {
        showMenu(difficultyMenu);
    });
    
    settingsBtn.addEventListener("click", () => {
        showMenu(settingsMenu);
    });
    
    backFromDifficulty.addEventListener("click", () => {
        showMenu(mainMenu);
    });
    
    backFromSettings.addEventListener("click", () => {
        showMenu(mainMenu);
    });
    
    easyBtn.addEventListener("click", () => {
        localStorage.setItem("memoryGameDifficulty", "easy");
        window.location.href = "game.html";
    });
    
    mediumBtn.addEventListener("click", () => {
        localStorage.setItem("memoryGameDifficulty", "medium");
        window.location.href = "game.html";
    });
    
    hardBtn.addEventListener("click", () => {
        localStorage.setItem("memoryGameDifficulty", "hard");
        window.location.href = "game.html";
    });
    
    const menuButtons = document.querySelectorAll(".menu-btn");
    menuButtons.forEach(button => {
        button.addEventListener("mouseover", () => {
            button.style.transform = "translateY(-3px)";
            button.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
        });
        
        button.addEventListener("mouseout", () => {
            button.style.transform = "";
            button.style.boxShadow = "";
        });
    });
});