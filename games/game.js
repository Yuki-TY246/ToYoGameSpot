class Masu {
    constructor (r, c){
        r = parseInt(r); c = parseInt(c);
        if(r < 0 || r >= 8 || c < 0 || c >= 8) throw 'out of board';
        this.r = r;
        this.c = c;
        this.id = 'r' + r + 'c' + c;
        this.td = $('#' + this.id);
    }

    ishi (){
        var div = $('div', this.td);
        return div.hasClass('black') ? ISHI_BLACK : (div.hasClass('white') ? ISHI_WHITE : ISHI_NONE);
    }

    set (ishi){
        var div = $('div', this.td);  // クラスを変更するdiv要素を取得
        if(ISHI_NONE == this.ishi()){  // 石が置かれていないとき
            div.removeClass('none');

        // 挟んだ石をひっくり返す
        }else{
            div.removeClass(ishi == ISHI_BLACK ? 'white' : 'black');
        }
        div.addClass(ishi == ISHI_BLACK ? 'black' : 'white');
    }
}