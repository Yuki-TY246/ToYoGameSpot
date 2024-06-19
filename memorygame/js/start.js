'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const startBt = document.getElementById('startBt');
  const title = document.getElementById('title');

  startBt.addEventListener('click', () => {
    // ゲームが始まる処理を記述
    // 例: ゲーム画面に遷移する、またはゲームを開始する
    // ここではスタート画面の要素を非表示にするだけの例を示します
    startBt.style.display = 'none'; // スタートボタンを非表示にする
    title.style.display = 'none'; // タイトルを非表示にする
    // ここにゲームの初期化やロジックを記述する
    initializeGame(); // 仮の関数名です。実際のゲームの初期化関数を呼び出します。
  });

  // 仮のゲーム初期化関数
  function initializeGame() {
    // ここにゲームの初期化処理を記述します
    console.log('ゲームが初期化されました！');
  }
});
