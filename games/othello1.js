const ISHI_BLACK = 1;
const ISHI_WHITE = -1;
const ISHI_NONE = 0;

var ishi = ISHI_BLACK;  // 石の白黒

jQuery(function () {
    // 盤面を初期化する関数
    function initBoard() {
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
                                if (ishi == ISHI_WHITE) {
                                    setTimeout(cpuPlayTurn, 500); // CPUのターンを呼び出す
                                }
                                if (isBoardFull()) {
                                    saveCountsAndRedirect();
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

    function updateStatus() {
        var blackCount = 0, whiteCount = 0;
        $('table#board td div').each(function () {
            if ($(this).hasClass('black')) blackCount++;
            else if ($(this).hasClass('white')) whiteCount++;
        });
        $('div#status').html('黒: ' + blackCount + ' 白: ' + whiteCount + ' ' + (ishi == ISHI_BLACK ? 'あなたの番' : 'CPUの番'));
    
        // ゲームの終了条件を追加する（必要に応じて）
        if (blackCount + whiteCount === 64 || blackCount === 0 || whiteCount === 0) {
            setTimeout(function() {
                saveCountsAndRedirect();
            }, 1500);
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
        location.href = 'game5.html';
    }

    function isBoardFull() {
        var full = true;
        $('table#board td div').each(function () {
            if ($(this).hasClass('none')) full = false;
        });
        return full;
    }

    function cpuPlayTurn() {
        var cpu = new CPU(ISHI_WHITE);
        cpu.playTurn();
        ishi = ISHI_BLACK;
        setTimeout(updateStatus, 500); // CPUのターン後にカウントを更新
        if (isBoardFull()) {
            saveCountsAndRedirect();
        }
    }

    initBoard();
});
