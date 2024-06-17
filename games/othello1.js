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
                    .click(function (e) {  // tdがクリックされたときの動作
                        var masu = new Masu($(this).attr('data-r'), $(this).attr('data-c'));
                        if (masu.ishi() == ISHI_NONE) {
                            var count = masu.set(ishi).roundReverse(false);
                            if (count > 0) {
                                masu.roundReverse(true);
                                ishi *= -1;
                                $('div#status').html((ishi == ISHI_BLACK ? 'あなた' : 'cpu') + 'の番');
                                if (ishi == ISHI_WHITE) {
                                    setTimeout(cpuPlayTurn, 500); // CPUのターンを呼び出す
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
    }

    initBoard();

    function cpuPlayTurn() {
        var cpu = new CPU(ISHI_WHITE);
        cpu.playTurn();
        ishi = ISHI_BLACK;
        $('div#status').html('あなたの番');
    }
});
