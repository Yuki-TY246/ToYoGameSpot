'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let gameStarted = false;
  let timerInterval = null;
  let startTime = null;
  let endTime = null;

  class Card {
    constructor(suit, num) {
      this.suit = suit;
      this.num = num;
      this.front = `images/${suit}${num < 10 ? '0' : ''}${num}.png`;
    }
  }

  const cards = [];
  const suits = ['s', 'd', 'h', 'c'];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 1; j <= 13; j++) {
      let card = new Card(suits[i], j);
      cards.push(card);
    }
  }

  let firstCard = null;
  let secondCard = null;

  const flip = (eve) => {
    if (!gameStarted) {
      startTimer();
      gameStarted = true;
    }
    let div = eve.target;
    if (!div.classList.contains('back') || secondCard !== null) {
      return;
    }
    div.classList.remove('back');
    if (firstCard === null) {
      firstCard = div;
    } else {
      secondCard = div;
      if (firstCard.num === secondCard.num) {
        firstCard.classList.add('fadeout');
        secondCard.classList.add('fadeout');
        checkGameComplete();
        [firstCard, secondCard] = [null, null];
      } else {
        setTimeout(() => {
          firstCard.classList.add('back');
          secondCard.classList.add('back');
          [firstCard, secondCard] = [null, null];
        }, 1200);
      }
    }
  };

  const checkGameComplete = () => {
    if (document.querySelectorAll('.fadeout').length === cards.length) {
      stopTimer();
      showGameResult();
    }
  };

  const cardgrid = document.getElementById('cardgrid');

  const initCardGrid = () => {
    cardgrid.textContent = null;
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < 13; j++) {
        let div = document.createElement('div');
        let card = cards[i * 13 + j];
        div.style.backgroundImage = `url(${card.front})`;
        div.classList.add('card', 'back');
        div.num = card.num;
        div.onclick = flip;
        cardgrid.append(div);
      }
    }
  };

  const shuffleCards = () => {
    let i = cards.length;
    while (i) {
      let index = Math.floor(Math.random() * i--);
      [cards[index], cards[i]] = [cards[i], cards[index]];
    }
  };

  const startBt = document.getElementById('startBt');
  const title = document.getElementById('title');
  const timerDisplay = document.getElementById('timer');
  const gameResult = document.getElementById('gameResult');
  const backBt = document.getElementById('backBt');
  const ruleBt = document.getElementById('ruleBt');
  const ruleScreen = document.getElementById('ruleScreen');
  const closeRuleBt = document.getElementById('closeRuleBt');

  startBt.addEventListener('click', () => {
    shuffleCards();
    initCardGrid();
    startBt.classList.add('hidden');
    title.classList.add('hidden');
    timerDisplay.style.display = 'block';
    gameStarted = false;
    firstCard = null;
    secondCard = null;
    ruleBt.style.display = 'none'; // スタートボタンを押したらルールボタンを非表示にする
  });

  const startTimer = () => {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    endTime = new Date().getTime();
  };

  const updateTimer = () => {
    let currentTime = new Date().getTime();
    let elapsedTime = currentTime - startTime;
    displayTimer(elapsedTime);
  };

  const displayTimer = (elapsedTime) => {
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const showGameResult = () => {
    let elapsedTime = endTime - startTime;
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    let clearTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    let clearTimeSpan = document.getElementById('clearTime');
    clearTimeSpan.textContent = clearTime;
    gameResult.style.display = 'block';
    timerDisplay.style.display = 'none';
  };

  backBt.addEventListener('click', () => {
    gameResult.style.display = 'none';
    startBt.classList.remove('hidden');
    title.classList.remove('hidden');
    timerDisplay.textContent = '00:00';
    timerDisplay.style.display = 'none';
    cardgrid.innerHTML = ''; // カードをクリアする
    gameStarted = false;
    ruleBt.style.display = 'block'; // リセット時にルールボタンを再表示する
  });

  ruleBt.addEventListener('click', () => {
    ruleScreen.style.display = 'block';
  });

  closeRuleBt.addEventListener('click', () => {
    ruleScreen.style.display = 'none';
  });

});
