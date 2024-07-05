let wins = 0;
let losses = 0;
let ties = 0;
let difficultyLevel = 1;
let lastPlayerChoice = null;

const winningMoves = {
    "rock": ["scissors", "lizard"],
    "paper": ["rock", "spock"],
    "scissors": ["paper", "lizard"],
    "lizard": ["spock", "paper"],
    "spock": ["scissors", "rock"]
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('level').addEventListener('change', (event) => {
        changeLevel(event.target.value);
    });
    document.querySelectorAll('.options button').forEach(button => {
        button.addEventListener('click', () => {
            playGame(button.getAttribute('aria-label'));
        });
    });
    document.querySelector('.reset-btn').addEventListener('click', resetGame);
});

function updateScoreboard() {
    document.getElementById('wins').innerText = wins;
    document.getElementById('losses').innerText = losses;
    document.getElementById('ties').innerText = ties;
}

function playGame(playerChoice) {
    lastPlayerChoice = playerChoice;
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    displayResult(playerChoice, computerChoice, result);
    updateScores(result);
    updateScoreboard();
    applyResultAnimation(result);
    playSound();
}

function getComputerChoice() {
    const choices = ["rock", "paper", "scissors", "lizard", "spock"];
    switch (difficultyLevel) {
        case 1:
            return choices[Math.floor(Math.random() * choices.length)];
        case 2:
            return getWeightedChoice();
        case 3:
            return getCounterChoice();
        default:
            return choices[Math.floor(Math.random() * choices.length)];
    }
}

function getWeightedChoice() {
    const choices = ["rock", "paper", "scissors", "lizard", "spock"];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    const winningChoice = winningMoves[randomChoice];
    return winningChoice[Math.floor(Math.random() * winningChoice.length)];
}

function getCounterChoice() {
    if (lastPlayerChoice) {
        // Pick one of the moves that beats the player's last choice
        const counterChoices = [];
        for (const [choice, beats] of Object.entries(winningMoves)) {
            if (beats.includes(lastPlayerChoice)) {
                counterChoices.push(choice);
            }
        }
        return counterChoices[Math.floor(Math.random() * counterChoices.length)];
    } else {
        return getWeightedChoice();
    }
}

function changeLevel(selectedLevel) {
    difficultyLevel = parseInt(selectedLevel);
    console.info(`Difficulty level changed to ${difficultyLevel}`);
}

function determineWinner(player, computer) {
    if (player === computer) {
        return "tie";
    }
    return winningMoves[player].includes(computer) ? "win" : "lose";
}

function updateScores(result) {
    switch (result) {
        case "win":
            wins++;
            break;
        case "lose":
            losses++;
            break;
        case "tie":
            ties++;
            break;
    }
}

function displayResult(player, computer, result) {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `You chose ${player}. Computer chose ${computer}. Result: ${result}`;
}

function applyResultAnimation(result) {
    const resultElement = document.getElementById("result");
    resultElement.classList.remove('resultFlashWin', 'resultFlashTie', 'resultFlashLose');
    void resultElement.offsetWidth; // Trigger reflow to restart animation

    const animationClass = {
        win: 'resultFlashWin',
        tie: 'resultFlashTie',
        lose: 'resultFlashLose'
    }[result];

    resultElement.classList.add(animationClass);

    const scoreboardDivs = document.querySelectorAll('.scoreboard div');
    scoreboardDivs.forEach(div => {
        div.style.animation = 'none';
        div.offsetHeight; // Trigger reflow to restart animation
        div.style.animation = 'scoreboardUpdate 0.5s ease-in-out';
    });
}

function playSound() {
    const clickSound = document.getElementById('clickSound');
    clickSound && clickSound.play();
}

function resetGame() {
    wins = 0;
    losses = 0;
    ties = 0;
    updateScoreboard();
}
