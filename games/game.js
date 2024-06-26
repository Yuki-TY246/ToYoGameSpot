class Masu {
    constructor (r, c){
        r = parseInt(r); c = parseInt(c);
        if(r < 0 || r >= 8 || c < 0 || c >= 8) throw 'out of board';
        this.r = r;// 行の位置を保存
        this.c = c;// 列の位置を保存
        this.id = 'r' + r + 'c' + c;// idを作成
        this.td = $('#' + this.id);// jQueryを使ってこのidに対応する<td>要素を取得
    }
    //マスに置かれている石の色を返す
    ishi (){
        var div = $('div', this.td);
        return div.hasClass('black') ? ISHI_BLACK : (div.hasClass('white') ? ISHI_WHITE : ISHI_NONE);
    }

    set (ishi){
        var div = $('div', this.td);  // クラスを変更するdiv要素を取得
        if(ISHI_NONE == this.ishi()){  // 石が置かれていないとき
            div.removeClass('none');

        }else{
            div.removeClass(ishi == ISHI_BLACK ? 'white' : 'black');
        }
        div.addClass(ishi == ISHI_BLACK ? 'black' : 'white');
        return this;
    }

    // 置いた石を除く
    remove (){
        $('div', this.td).removeClass('white').removeClass('black').addClass('none');
        return this;
    }
    //反転可能な石をすべて反転させる処理
    roundReverse(exec){
        var count = 0;
        for(var dr of [-1, 0, 1]){
            for(var dc of [-1, 0, 1]){
                if(dr == 0 && dc == 0) continue;
                count += this.reverse(0, this, dc, dr, exec);
            }
        }
        return count;
    }
    //ひっくり返す処理
    reverse (count, a0, dr, dc, exec){
        try{
            var neighbor = new Masu(this.r + dr, this.c + dc);

            if(ISHI_NONE == neighbor.ishi()) return 0;
            if(a0.ishi() != neighbor.ishi()) count = neighbor.reverse(count + 1, a0, dr, dc, exec);

            if(exec && count > 0){
                this.set(a0.ishi());
            }
            return count;

        // 盤面の外のとき0を返す
        }catch(e){
            return 0;
        }
    }
}