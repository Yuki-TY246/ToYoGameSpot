const ISHI_BLACK = 1;
const ISHI_WHITE = -1;
const ISHI_NONE = 0;

var ishi = ISHI_BLACK;  // 石の白黒

jQuery(function () {
    // 盤面を初期化する関数
    function initBoard() {
        $('table#board').empty(); // ボードをクリア
        for (var r = 0; r < 8; r++) {
            var tr = $("<tr>");
            for (var c = 0; c < 8; c++) {
                // tdにid, data-r, data-c属性を設定する
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
                                ishi *= -1;
                                updateStatus();
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


    function updateStatus() {
        var blackCount = 0, whiteCount = 0;
        $('table#board td div').each(function () {
            if ($(this).hasClass('black')) blackCount++;
            else if ($(this).hasClass('white')) whiteCount++;
        });

        $('div#status1').html('<ruby>黒<rt>くろ</rt></ruby>:' +  blackCount  + '<ruby>枚<rt>まい</rt></ruby>');
        $('div#status2').html('<ruby>白<rt>しろ</rt></ruby>:' +  whiteCount  + '<ruby>枚<rt>まい</rt></ruby>');
        $('div#status').html(ishi == ISHI_BLACK ? '<ruby>黒<rt>くろ</rt></ruby>の<ruby>番<rt>ばん</rt></ruby>' : '<ruby>白<rt>しろ</rt></ruby>の<ruby>番<rt>ばん</rt></ruby>');
     
        
        if (blackCount + whiteCount === 64 || blackCount === 0 || whiteCount === 0) {
            setTimeout(function() {
                saveCountsAndRedirect();
            }, 1500);

        }
        if (ishi == ISHI_BLACK) {
            highlightLegalMoves1(ishi);
        }
        if (ishi == ISHI_WHITE) {
            highlightLegalMoves2(ishi);
        }
        
    }

    function checkPass() {
        if (!canPlay(ishi)) {
            ishi *= -1;
            updateStatus();
        }else{
            alert('ひかっているところにおけるよ!');
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

    function saveCountsAndRedirect() {
        var blackCount = 0, whiteCount = 0;
        $('table#board td div').each(function () {
            if ($(this).hasClass('black')) blackCount++;
            else if ($(this).hasClass('white')) whiteCount++;
        });
        localStorage.setItem('blackCount', blackCount);
        localStorage.setItem('whiteCount', whiteCount);
        location.href = 'game6.html';
    }

    // ゲームをリセットする関数リセットボタンを押下時実行
    function resetGame() {
        initBoard(); // ボードを再初期化
    }

    window.resetGame = resetGame;
    window.checkPass = checkPass;
    initBoard();

          // 置ける場所をハイライトする関数
function highlightLegalMoves1(ishi) {
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
                    $('#r' + r + 'c' + c + ' div').addClass('highlight').parent().css('background-color', '#538955');
                }
            }
        }
    }
}
});


