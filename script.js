// script.js

const levels = [
    { numbers: [1, 2, 3, 4, 5], order: 'ascending' },
    { numbers: [6, 7, 8, 9, 10], order: 'ascending' },
    { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'ascending' },
    { numbers: [1, 2, 3, 4, 5], order: 'descending' },
    { numbers: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), order: 'descending' }
];

let currentLevel = 0;
let selectedChoices = [];

document.addEventListener('DOMContentLoaded', initGame);

function initGame() {
    setupLevel(levels[currentLevel]);
}

function setupLevel(level) {
    const dropBoxesContainer = document.getElementById('drop-boxes');
    const choicesContainer = document.getElementById('choices');
    const gameTitle = document.getElementById('game-title');

    dropBoxesContainer.innerHTML = '';
    choicesContainer.innerHTML = '';
    selectedChoices = [];

    gameTitle.innerText = level.order === 'ascending' ? 'Järjestä numerot pienimmästä suurimpaan' : 'Järjestä numerot suurimmasta pienimpään';

    // Luodaan pudotuslaatikot oikeassa järjestyksessä
    level.numbers.slice().sort((a, b) => level.order === 'ascending' ? a - b : b - a).forEach(() => {
        const box = document.createElement('div');
        box.classList.add('box');
        dropBoxesContainer.appendChild(box);
    });

    // Luodaan valintanumerot satunnaisessa järjestyksessä
    shuffle(level.numbers).forEach(number => {
        const choice = document.createElement('div');
        choice.classList.add('choice');
        choice.style.backgroundImage = `url('${number}.png')`; // Käytetään kuvatiedostoja
        choice.onclick = () => handleChoiceClick(choice, number);
        choicesContainer.appendChild(choice);
    });
}

function handleChoiceClick(choiceElement, number) {
    const dropBoxes = document.querySelectorAll('#drop-boxes .box');
    const currentDropBox = dropBoxes[selectedChoices.length];

    if (currentDropBox) {
        const level = levels[currentLevel];
        const correctNumber = level.order === 'ascending' ? level.numbers.sort((a, b) => a - b)[selectedChoices.length] : level.numbers.sort((a, b) => b - a)[selectedChoices.length];

        if (number === correctNumber) {
            currentDropBox.style.backgroundImage = `url('${number}.png')`;
            playSound(number);
            selectedChoices.push(number);
            choiceElement.classList.add('faded'); // Muutetaan numeron ulkoasua haaleammaksi

            if (selectedChoices.length === level.numbers.length) {
                if (currentLevel < levels.length - 1) {
                    document.getElementById('next-level').style.display = 'block';
                } else {
                    showCompletionMessage();
                }
            }
        } else {
            choiceElement.classList.add('incorrect');
            setTimeout(() => {
                choiceElement.classList.remove('incorrect');
            }, 1000);
        }
    }
}

function playSound(number) {
    const audio = new Audio(`${number}.mp3`);
    audio.play().catch(error => console.error('Audio play error:', error));
}

document.getElementById('next-level').onclick = () => {
    currentLevel++;
    setupLevel(levels[currentLevel]);
    document.getElementById('next-level').style.display = 'none';
}

function showCompletionMessage() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <h1>HIENOA!</h1>
        <div>
            <span class="star">&#9733;</span>
            <span class="star">&#9733;</span>
            <span class="star">&#9733;</span>
        </div>
        <button id="restart-game">Pelaa uudelleen</button>
    `;
    document.getElementById('restart-game').onclick = restartGame;
}

function restartGame() {
    currentLevel = 0;
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = `
        <h1 id="game-title"></h1>
        <div id="drop-boxes"></div>
        <div id="choices"></div>
        <button id="next-level" style="display: none;">Seuraava taso</button>
    `;
    initGame();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
