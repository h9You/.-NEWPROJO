class ProblemGenerator {
    constructor() {
        this.firstNumber = document.getElementById('first-number');
        this.secondNumber = document.getElementById('second-number');
        this.operationSymbol = document.getElementById('operation-symbol');
        this.numberRange = document.getElementById('number-range');
        this.operationType = document.getElementById('operation-type');
    }

    generateProblem = () => {
        const range = parseInt(this.numberRange.value);
        const operation = this.operationType.value;
        let num1, num2;
        
        if (operation === '/') {
            num2 = Math.floor(Math.random() * 9) + 1;
            num1 = num2 * (Math.floor(Math.random() * (range/10)) + 1);
        } else if (operation === '-') {
            num1 = Math.floor(Math.random() * range) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
        } else {
            num1 = Math.floor(Math.random() * range) + 1;
            num2 = Math.floor(Math.random() * range) + 1;
        }
        
        let displaySymbol = operation;
        if (operation === '*') {
            displaySymbol = '×';
        } else if (operation === '/') {
            displaySymbol = '÷';
        }
        
        this.firstNumber.textContent = num1;
        this.secondNumber.textContent = num2;
        this.operationSymbol.textContent = displaySymbol;
        
        return { num1, num2, operation, displaySymbol };
    }

    checkAnswer = (userAnswer) => {
        const correctAnswer = this.calculateCorrectAnswer();
        return {
            isCorrect: Math.abs(userAnswer - correctAnswer) < 0.001,
            correctAnswer
        };
    }

    calculateCorrectAnswer = () => {
        const num1 = parseInt(this.firstNumber.textContent);
        const num2 = parseInt(this.secondNumber.textContent);
        const op = this.operationType.value;
        
        switch(op) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return num1 / num2;
            default: return 0;
        }
    }

    getCurrentProblemText = () => {
        let opSymbol = this.operationSymbol.textContent;
        return `${this.firstNumber.textContent} ${opSymbol} ${this.secondNumber.textContent}`;
    }
}

class UIManager {
    constructor() {
        this.answerInput = document.getElementById('answer-input');
        this.submitButton = document.getElementById('submit-button');
        this.problemCard = document.querySelector('.problem-card');
        this.currentLevel = document.getElementById('current-level');
        this.timeDisplay = document.getElementById('time-display');
        this.correctCounter = document.getElementById('correct-counter');
        this.progressFill = document.getElementById('progress-fill');
        this.currentQuestion = document.getElementById('current-question');
        this.resultsBody = document.getElementById('results-body');
        
        this.completionModal = document.getElementById('completion-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.correctCount = document.getElementById('correct-count');
        this.successRate = document.getElementById('success-rate');
        this.continueButton = document.getElementById('continue-button');
    }

    clearAnswerInput = () => {
        this.answerInput.value = '';
        this.answerInput.focus();
    }

    updateProgress = (questionsAnswered) => {
        const progress = (questionsAnswered / 10) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.currentQuestion.textContent = questionsAnswered;
    }

    updateTimeDisplay = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        this.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateCorrectCounter = (correctAnswers) => {
        this.correctCounter.textContent = correctAnswers;
    }

    updateLevelDisplay = (levelName) => {
        this.currentLevel.textContent = levelName;
    }

    addResultToTable = (problem, correctAnswer, userAnswer, isCorrect) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td data-label="Problem">${problem}</td>
            <td data-label="Correct">${correctAnswer}</td>
            <td data-label="Your Answer">${userAnswer}</td>
            <td data-label="Result" class="${isCorrect ? 'result-correct' : 'result-wrong'}">
                ${isCorrect ? '✓' : '✗'}
            </td>
        `;
        
        if (this.resultsBody.firstChild) {
            this.resultsBody.insertBefore(row, this.resultsBody.firstChild);
        } else {
            this.resultsBody.appendChild(row);
        }
    }

    clearResultsTable = () => {
        this.resultsBody.innerHTML = '';
    }

    showAnswerFeedback = (isCorrect) => {
        this.problemCard.classList.add(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => {
            this.problemCard.classList.remove('correct', 'wrong');
        }, 500);
    }

    showCompletionModal = (title, message, correctAnswers, totalAnswers) => {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.correctCount.textContent = correctAnswers;
        
        const successRateValue = (correctAnswers / totalAnswers) * 100;
        this.successRate.textContent = `${Math.round(successRateValue)}%`;
        
        this.completionModal.style.display = 'flex';
    }

    hideCompletionModal = () => {
        this.completionModal.style.display = 'none';
    }
}

class TimerManager {
    constructor(uiManager) {
        this.seconds = 0;
        this.timer = null;
        this.questionTimer = null;
        this.uiManager = uiManager;
    }

    startGameTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.seconds++;
            this.uiManager.updateTimeDisplay(this.seconds);
        }, 1000);
    }

    startQuestionTimer = (callback, seconds = 10) => {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
        }
        
        this.questionTimer = setTimeout(callback, seconds * 1000);
    }

    clearQuestionTimer = () => {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }
    }

    clearAllTimers = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.clearQuestionTimer();
    }

    resetSeconds = () => {
        this.seconds = 0;
        this.uiManager.updateTimeDisplay(0);
    }
}

class Game {
    constructor() {
        this.uiManager = new UIManager();
        this.problemGenerator = new ProblemGenerator();
        this.timerManager = new TimerManager(this.uiManager);
        
        this.levels = ['Beginner', 'Intermediate', 'Advanced'];
        this.currentLevel = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.isGameActive = false;
    }

    init = () => {
        this.setupEventListeners();
        
        this.resetGame();
    }

    setupEventListeners = () => {
        this.uiManager.submitButton.addEventListener('click', this.handleAnswerSubmission);
        this.uiManager.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAnswerSubmission();
            }
        });
        
        this.problemGenerator.numberRange.addEventListener('change', () => {
            if (this.isGameActive) {
                this.generateNewProblem();
            }
        });
        
        this.problemGenerator.operationType.addEventListener('change', () => {
            if (this.isGameActive) {
                this.generateNewProblem();
            }
        });
        
        this.uiManager.continueButton.addEventListener('click', () => {
            this.uiManager.hideCompletionModal();
            
            if (this.correctAnswers >= 7 && this.currentLevel < 2) {
                this.startLevel(this.currentLevel + 1);
            } else {
                this.startLevel(this.currentLevel);
            }
        });
    }

    handleAnswerSubmission = () => {
        if (!this.isGameActive || !this.uiManager.answerInput.value) return;
        
        this.timerManager.clearQuestionTimer();
        
        const userAnswer = parseFloat(this.uiManager.answerInput.value);
        const { isCorrect, correctAnswer } = this.problemGenerator.checkAnswer(userAnswer);
        
        this.uiManager.showAnswerFeedback(isCorrect);
        
        if (isCorrect) {
            this.correctAnswers++;
            this.uiManager.updateCorrectCounter(this.correctAnswers);
        }
        
        this.uiManager.addResultToTable(
            this.problemGenerator.getCurrentProblemText(),
            correctAnswer,
            userAnswer,
            isCorrect
        );
        
        this.questionsAnswered++;
        this.uiManager.updateProgress(this.questionsAnswered);
        
        if (this.questionsAnswered >= 10) {
            this.completeChallenge();
        } else {
            this.generateNewProblem();
        }
    }

    generateNewProblem = () => {
        this.problemGenerator.generateProblem();
        this.uiManager.clearAnswerInput();
        
        this.timerManager.startQuestionTimer(() => {
            const correctAnswer = this.problemGenerator.calculateCorrectAnswer();
            
            this.uiManager.addResultToTable(
                this.problemGenerator.getCurrentProblemText(),
                correctAnswer,
                'Time out',
                false
            );
            
            this.uiManager.showAnswerFeedback(false);
            
            this.questionsAnswered++;
            this.uiManager.updateProgress(this.questionsAnswered);
            
            if (this.questionsAnswered >= 10) {
                this.completeChallenge();
            } else {
                this.generateNewProblem();
            }
        });
    }

    startLevel = (level) => {
        this.timerManager.clearQuestionTimer();
        
        this.currentLevel = level;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.isGameActive = true;
        
        // Update UI
        this.uiManager.updateLevelDisplay(this.levels[level]);
        this.uiManager.updateCorrectCounter(0);
        this.problemGenerator.numberRange.value = level === 0 ? '10' : level === 1 ? '100' : '1000';
        
        this.uiManager.clearResultsTable();
        
        this.uiManager.updateProgress(0);
        
        this.generateNewProblem();
    }

    completeChallenge = () => {
        this.isGameActive = false;
        
        let title, message;
        
        if (this.correctAnswers >= 7) {
            if (this.currentLevel < 2) {
                title = 'Challenge Complete!';
                message = 'Great job! You can now advance to the next level.';
            } else {
                title = 'Master Achieved!';
                message = 'Congratulations! You\'ve mastered all levels!';
            }
        } else {
            title = 'Challenge Incomplete';
            message = 'You need at least 7 correct answers to advance. Try again!';
        }
        
        this.uiManager.showCompletionModal(
            title, message, this.correctAnswers, 10
        );
    }

    resetGame = () => {
        this.timerManager.clearAllTimers();
        
        this.correctAnswers = 0;
        this.timerManager.resetSeconds();
        this.uiManager.updateCorrectCounter(0);
        
        this.startLevel(0);
        
        this.timerManager.startGameTimer();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mathMaster = new Game();
    mathMaster.init();
});