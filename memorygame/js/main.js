'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ゲーム全体のステータス
  let gameStarted = false;
  let timerInterval = null;
  let startTime = null;
  let endTime = null;

  // Cardクラス作成
  class Card {
    constructor(suit, num) {
      this.suit = suit;
      this.num = num;
      this.front = `${suit}${num < 10 ? '0' : ''}${num}.png`;
    }
  }

  // カード配列作成
  const cards = [];
  // カードスーツ配列
  const suits = ['s', 'd', 'h', 'c'];
  // 2重forで52枚のカードを作成
  for (let i = 0; i < suits.length; i++) {
    for (let j = 1; j <= 13; j++) {
      // カードインスタンス生成(s1, s2....c13)
      let card = new Card(suits[i], j);
      // 配列の末尾に追加
      cards.push(card);
    }
  }

  let firstCard = null; // 1枚目のカードを保持(引いてない場合はnull)
  let secondCard = null; // 2枚目のカードを保持(引いてない場合はnull)

  // クリックした際の関数を定義
  const flip = (eve) => {
    if (!gameStarted) {
      startTimer(); // ゲームが始まっていなければタイマーを開始する
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
        checkGameComplete(); // ゲームが完了したかどうかチェックする
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

  // ゲームが完了したかどうかをチェックする
  const checkGameComplete = () => {
    if (document.querySelectorAll('.fadeout').length === cards.length) {
      stopTimer(); // タイマーを停止する
      showGameResult(); // ゲーム結果を表示する
    }
  };

  // カードグリッドのDOM取得
  const cardgrid = document.getElementById('cardgrid');

  // カードグリッドを初期化する処理
  const initCardGrid = () => {
    cardgrid.textContent = null;
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < 13; j++) {
        let div = document.createElement('div');
        let card = cards[i * 13 + j];
        div.style.backgroundImage = `url(images/${card.front})`;
        div.classList.add('card', 'back');
        div.onclick = flip;
        div.num = card.num;
        cardgrid.append(div);
      }
    }
  };

  // カードシャッフル関数(Fisher–Yates shuffle)
  const shuffleCards = () => {
    let i = cards.length;
    while (i) {
      let index = Math.floor(Math.random() * i--);
      [cards[index], cards[i]] = [cards[i], cards[index]];
    }
  };

  // スタートボタンのDOM取得
  const startBt = document.getElementById('startBt');
  const title = document.getElementById('title');
  const timerDisplay = document.getElementById('timer');
  const gameResult = document.getElementById('gameResult');
  const backBt = document.getElementById('backBt');

  // スタートボタンをクリックしたときの処理
  startBt.addEventListener('click', () => {
    shuffleCards(); // カードをシャッフルする
    initCardGrid(); // カードグリッドを初期化する
    startBt.style.display = 'none'; // スタートボタンを非表示にする
    title.style.display = 'none'; // タイトルを非表示にする
    timerDisplay.style.display = 'block'; // タイマーを表示する
    gameStarted = false;
    firstCard = null;
    secondCard = null;
  });

  // タイマーを開始する
  const startTimer = () => {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000); // 1秒ごとにタイマーを更新する
  };

  // タイマーを停止する
  const stopTimer = () => {
    clearInterval(timerInterval);
    endTime = new Date().getTime();
  };

  // タイマーを更新する
  const updateTimer = () => {
    let currentTime = new Date().getTime();
    let elapsedTime = currentTime - startTime;
    displayTimer(elapsedTime);
  };

  // タイマーを表示する
  const displayTimer = (elapsedTime) => {
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // タイマー表示用の要素を取得
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // ゲーム結果を表示する
  const showGameResult = () => {
    let elapsedTime = endTime - startTime;
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    let clearTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // ゲーム結果を表示する
    let clearTimeSpan = document.getElementById('clearTime');
    clearTimeSpan.textContent = clearTime;
    gameResult.style.display = 'block'; // ゲーム結果を表示する
    timerDisplay.style.display = 'none'; // タイマーを非表示にする
  };

  // ゲームに戻るボタンをクリックしたときの処理
  backBt.addEventListener('click', () => {
    gameResult.style.display = 'none'; // ゲーム結果を非表示にする
    startBt.style.display = 'block'; // スタートボタンを再表示する
    title.style.display = 'block'; // タイトルを再表示する
    timerDisplay.style.display = 'none'; // タイマーを非表示にする
    timerDisplay.textContent = '00:00'; // タイマーをリセットする
  });

});
