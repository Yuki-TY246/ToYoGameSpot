const ISHI_BLACK = 1;
const ISHI_WHITE = -1;
const ISHI_NONE = 0;

var ishi = ISHI_BLACK;  // 石の白黒

jQuery(function (){
    for(var r = 0 ; r < 8 ; r ++){
        var tr = $("<tr>");
        for(var c = 0 ; c < 8 ; c ++){
            // tdにid, data-r, data-c属性を設定する
            tr.append($('<td><div class="none"></div></td>')
                .attr({'id': 'r' + r + 'c' + c, 'data-r': r, 'data-c': c})
                .click(function (e){  // tdがクリックされたときの動作
                    var masu = new Masu($(this).attr('data-r'), $(this).attr('data-c'));
                    if(masu.ishi() == ISHI_NONE){
                        masu.set(ishi);
                        for(var dr of [-1, 0, 1]){
                            for(var dc of [-1, 0, 1]){
                                if(dr == 0 && dc == 0) continue;
                                masu.reverse(0, masu, dc, dr);
                            }
                        }
                        ishi *= -1;
                        $('div#status').html((ishi == ISHI_BLACK ? '黒' : '白') + 'の番');
                    }else{
                        masu.set(ishi * -1);
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
});