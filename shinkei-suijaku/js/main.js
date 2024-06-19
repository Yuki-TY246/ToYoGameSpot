'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  //Cardクラス作成
  class Card{
    constructor(suit,num){
      //カードのスート(s:スペード、d:ダイヤ...)
      this.suit=suit;
      //カードの数字(1,2,...13)
      this.num=num;
      //カードの画像
      this.front=`${suit}${num < 10 ? '0':''}${num}.gif`;
    }
  }
  //カード配列作成
  const cards=[];
  //カードスーツ配列
  const suits=['s','d','h','c'];
  //2重forで52枚のカードを作成
  for(let i=0;i<suits.length;i++){
    for(let j=1;j<=13;j++){
      //カードインスタンス生成(s1,s2....c13)
      let card=new Card(suits[i],j);
      //配列の末尾に追加
      cards.push(card);
    }
  }
  //cardgridのDOM取得
  const cardgrid=document.getElementById('cardgrid');
  //gridを初期化する処理
  const initgrid=()=>{
    //cardgridに入っている要素をすべて削除
    cardgrid.textContent=null;
    for(let i=0;i<suits.length;i++){
      for(let j=0;j<13;j++){
        //１枚毎のトランプとなるdiv要素作成
        let div=document.createElement('div');
        //配列からcardを取り出す
        let card=cards[i*13+j];
        //divの<div>この部分</div>(textContent)を設定
        //textContentは不要なのでコメント化
        //div.textContent=card.suit+':'+card.num;
        //背景画像に画像を設定
        div.style.backgroundImage=`url(images/${card.front})`;
        //divにcardクラス追加
        div.classList.add('card');
        //cardgrid要素に追加
        cardgrid.append(div);
      }
    }
  };
  //ボタンのDOM取得
  const startBt=document.getElementById('startBt');
  //ボタンを押したときの処理
  startBt.addEventListener('click',()=>{
    initgrid();
  }); 
});