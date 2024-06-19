'use strict';

document.addEventListener('DOMContentLoaded', () => {
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

  // cardgridのDOM取得
  const cardgrid = document.getElementById('cardgrid');

  // gridを初期化する処理
  const initgrid = () => {
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
  const shuffle = () => {
    let i = cards.length;
    while (i) {
      let index = Math.floor(Math.random() * i--);
      [cards[index], cards[i]] = [cards[i], cards[index]];
    }
  };

  // ボタンのDOM取得
  const startBt = document.getElementById('startBt');
  const title = document.getElementById('title');

  // ボタンを押したときの処理
  startBt.addEventListener('click', () => {
    shuffle();
    initgrid();
    startBt.style.display = 'none'; // スタートボタンを非表示にする
    title.style.display = 'none'; // タイトルを非表示にする
  });

});
