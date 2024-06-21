const ISHI_BLACK = 1;  
const ISHI_WHITE = -1; 
const ISHI_NONE = 0;

var ishi = ISHI_BLACK;  // 石の白黒
var humanFirst; //プレイヤーが先行か後攻か判定
var ishiHuman; //プレイヤーの石の色
var ishiCPU;  //cpuの石の色
var cpu;  // cpuのインスタンス
var gameOver = false;//ゲーム終了時のアラート



jQuery(function () {
    // 盤面を初期化する関数
    function initBoard() {
        $('table#board').empty(); // ボードをクリア
        for (var r = 0; r < 8; r++) {
            var tr = $("<tr>");
            for (var c = 0; c < 8; c++) {
                tr.append($('<td><div class="none"></div></td>')
                    .attr({ 'id': 'r' + r + 'c' + c, 'data-r': r, 'data-c': c })
                    .hover(function () {
                        $(this).addClass('hover');
                    }, function () {
                        $(this).removeClass('hover');
                    })
                    
                    .click(function (e) {  // tdがクリックされたときの動作
                        var masu = new Masu($(this).attr('data-r'), $(this).attr('data-c'));
                        if (masu.ishi() == ISHI_NONE) {
                            var count = masu.set(ishi).roundReverse(false);
                            if (count > 0) {
                                masu.roundReverse(true);
                                ishi = ishiCPU;    
                                updateStatus();
                                $('table#board td div').removeClass('highlight'); // ハイライトをクリア
                                if (ishi == ishiCPU) {
                                    setTimeout(cpuPlayTurn, 500); // CPUのターンを呼び出す、500ミリ秒後に実行
                                }
                            } else {
                                masu.remove();
                            }
                        }
                    })
                );
            }
            $('table#board').append(tr);
        }

        // 初期配置
        new Masu(3, 3).set(ISHI_BLACK);
        new Masu(4, 4).set(ISHI_BLACK);
        new Masu(3, 4).set(ISHI_WHITE);
        new Masu(4, 3).set(ISHI_WHITE);

        updateStatus();
    }

      // 置ける場所をハイライトする関数
function highlightLegalMoves1(ishi) {
    // 既存のハイライトをクリア
    $('table#board td div').removeClass('highlight');
    // 盤面全体をチェック
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            var masu = new Masu(r, c);
            $('#r' + r + 'c' + c + ' div').addClass('highlight').parent().css('background-color', 'green');
            if (masu.ishi() == ISHI_NONE) {
                var count = masu.set(ishi).roundReverse(false);
                masu.remove();
                if (count > 0) {
                    // ハイライトクラスを適用し、背景色を変える
                    $('#r' + r + 'c' + c + ' div').addClass('highlight').parent().css('background-color', '#538955');
                }
            }
        }
    }
}
function highlightLegalMoves2(ishi) {
    // 既存のハイライトをクリア
    $('table#board td div').removeClass('highlight');
    // 盤面全体をチェック
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            $('#r' + r + 'c' + c + ' div').addClass('highlight').parent().css('background-color', 'green');
            var masu = new Masu(r, c);
            if (masu.ishi() == ISHI_NONE) {
                var count = masu.set(ishi).roundReverse(false);
                masu.remove();
                if (count > 0) {
                    // ハイライトクラスを適用し、背景色を変える
                    $('#r' + r + 'c' + c + ' div').addClass('highlight').parent().css('background-color', 'green');
                }
            }
        }
    }
}

    // ステータスを更新する関数 白黒のカウントと終了判定を行っている
    function updateStatus() {
        var blackCount = 0, whiteCount = 0;
        $('table#board td div').each(function () {
            if ($(this).hasClass('black')) blackCount++ ;
            else if ($(this).hasClass('white')) whiteCount++;
        });
        $('div#status').html(ishi == ishiHuman ? 'あなたの<ruby>番<rt>ばん</rt></ruby>' : 'CPUの<ruby>番<rt>ばん</rt></ruby>');
        if(ishiHuman==-1){//先行後攻の自分の色の表示の修正
            $('div#status1').html('<ruby>白<rt>しろ</rt></ruby>:' + whiteCount + '<ruby>枚<rt>まい</rt></ruby>');
            $('div#status2').html('<ruby>黒<rt>くろ</rt></ruby>:' + blackCount + '<ruby>枚<rt>まい</rt></ruby>');
        }else{
            $('div#status1').html('<ruby>黒<rt>くろ</rt></ruby>:' + blackCount + '<ruby>枚<rt>まい</rt></ruby>');
            $('div#status2').html('<ruby>白<rt>しろ</rt></ruby>:' + whiteCount + '<ruby>枚<rt>まい</rt></ruby>');
        }
         // ゲームが終了した場合、結果を保存してリダイレクト
        if (blackCount + whiteCount === 64 || blackCount === 0 || whiteCount === 0) {
            gameOver = true;
            setTimeout(function () {
                saveCountsAndRedirect();
            }, 1500);

        }
        // 自分のターンの最初に置ける場所をハイライト
        if (ishi == ishiHuman) {
            highlightLegalMoves1(ishi);
        }
        if (ishi == ishiCPU) {
            highlightLegalMoves2(ishi);
        }
        
    }
     // カウントを保存してリダイレクトする関数
    function saveCountsAndRedirect() {
        var blackCount = 0, whiteCount = 0;
        $('table#board td div').each(function () {
            if ($(this).hasClass('black')) blackCount++;
            else if ($(this).hasClass('white')) whiteCount++;
        });

        localStorage.setItem('blackCount', blackCount);
        localStorage.setItem('whiteCount', whiteCount);
        // 勝敗を判定して保存
        if (ishiHuman == ISHI_BLACK) {
            if (blackCount > whiteCount) {
                localStorage.setItem('result', 'あなたのかち！');
            } else if (blackCount < whiteCount) {
                localStorage.setItem('result', 'まけ');
            } else {
                localStorage.setItem('result', 'ひきわけ');
            }
        } else {
            if (whiteCount > blackCount) {
                localStorage.setItem('result', 'あなたのかち!');
            } else if (whiteCount < blackCount) {
                localStorage.setItem('result', 'まけ');
            } else {
                localStorage.setItem('result', 'ひきわけ');
            }
        }
        location.href = 'game5.html';
    }

    // CPUのターンを実行する関数
    function cpuPlayTurn() {
        cpu.playTurn();
        ishi = ishiHuman;
        setTimeout(updateStatus, 500); // CPUのターン後にカウントを更新

    }
     // パスをチェックする関数cpuのパス機能はcpu.jsに記述
    function checkPass() {
        if (!canPlay(ishiHuman)) {
            ishi = ishiCPU;
            updateStatus();
            setTimeout(cpuPlayTurn, 500); // CPUのターンを呼び出す
        }else{
            alert('ひかっているところにおけるよ!');
        }
    }

    // ゲームを初期化する関数
    function initGame() {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var order = parseInt(urlParams.get('order'));

        humanFirst = order === 1;
        ishiHuman = humanFirst ? ISHI_BLACK : ISHI_WHITE;
        ishiCPU = humanFirst ? ISHI_WHITE : ISHI_BLACK;

        $('div#status').html(humanFirst ? 'あなたの<ruby>番<rt>ばん</rt></ruby>:' : 'CPUの<ruby>番<rt>ばん</rt></ruby>:');

        ishi = ishiHuman;
        cpu = new CPU(ishiCPU);

        initBoard();

        if (!humanFirst) {
            $('div#status').html('CPUの<ruby>番<rt>ばん</rt></ruby>:');
            setTimeout(cpuPlayTurn, 10); // CPUが先攻の場合、CPUのターンを始める
        }
    }

     // 指定された色で置けるかできるかどうかを判定する関数
    function canPlay(ishi) {
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                var masu = new Masu(r, c);
                if (masu.ishi() == ISHI_NONE) {
                    var count = masu.set(ishi).roundReverse(false);
                    masu.remove();
                    if (count > 0) {
                        return true;
                    }
                }
            }
        }
    }


     // ゲームをリセットする関数リセットボタンを押下時実行
    function resetGame() {
        initBoard(); // ボードを再初期化
        ishi = ishiHuman; // 石の色をプレイヤーの色にリセット
        $('div#status').html(humanFirst ? 'あなたの<ruby>番<rt>ばん</rt></ruby>:' : 'CPUの<ruby>番<rt>ばん</rt></ruby>:');
        if (!humanFirst) {
            cpuPlayTurn(); // CPUが先攻の場合、CPUのターンを始める
        }
    }

    window.resetGame = resetGame;


    
window.checkPass = checkPass;

    initGame();

    $(function() {
        $('.btn').on('click', function() {
            $('.btn').hide();
            $('.loading').show();
     
            // 3秒後に元に戻す
            setTimeout(function() {
                $('.btn').show();
                $('.loading').hide();
            }, 3000);
        });
    });
});
