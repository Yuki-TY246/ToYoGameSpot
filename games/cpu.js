class Masu {
    constructor(r, c) {
        r = parseInt(r);// 行の位置を整数に変換
        c = parseInt(c);// 列の位置を整数に変換
        if (r < 0 || r >= 8 || c < 0 || c >= 8) throw 'ボード外です';// 範囲チェック
        this.r = r;// 行の位置を保存
        this.c = c;// 列の位置を保存
        this.id = 'r' + r + 'c' + c; // idを作成
        this.td = $('#' + this.id);// jQueryを使ってこのidに対応する<td>要素を取得
    }
    //マスに置かれている石の色を返す
    ishi() {
        var div = $('div', this.td);
        return div.hasClass('black') ? ISHI_BLACK : (div.hasClass('white') ? ISHI_WHITE : ISHI_NONE);
    }
    //石を増すに置くための処理
    set(ishi) {
        var div = $('div', this.td);// クラスを変更するdiv要素を取得

        if (ISHI_NONE == this.ishi()) {// 石が置かれていないとき
            div.removeClass('none');// 'none' クラスを除去して、マスに何も置かれていない状態を解除
        } else {
            div.removeClass(ishi == ISHI_BLACK ? 'white' : 'black');// 既にマスに置かれている石の色のクラスを除去
        }

        div.addClass(ishi == ISHI_BLACK ? 'black' : 'white');// 指定された石の色のクラスを追加して石を置く
        return this;
    }
    // 置いた石を除く
    remove() {
        $('div', this.td).removeClass('white').removeClass('black').addClass('none');
        return this;
    }
    //反転可能な石をすべて反転させる処理
    roundReverse(exec) {
        var count = 0;
        for (var dr of [-1, 0, 1]) {
            for (var dc of [-1, 0, 1]) {
                if (dr == 0 && dc == 0) continue;
                count += this.reverse(0, this, dc, dr, exec);
            }
        }
        return count;
    }
    //ひっくり返す処理
    reverse(count, a0, dr, dc, exec) {
        try {
            var neighbor = new Masu(this.r + dr, this.c + dc);

            if (ISHI_NONE == neighbor.ishi()) return 0;
            if (a0.ishi() != neighbor.ishi()) count = neighbor.reverse(count + 1, a0, dr, dc, exec);

            if (exec && count > 0) {
                this.set(a0.ishi());
            }
            return count;
        // 盤面の外のとき0を返す    
        } catch (e) {
            return 0;
        }
    }
}

class CPU {
    constructor(ishi) {
        this.ishi = ishi;
    }
     // すべてのマスをチェック
    playTurn() {
        if (gameOver) return; // ゲーム終了時は何もしない

            var possibleMoves = [];

            for (var r = 0; r < 8; r++) {
                for (var c = 0; c < 8; c++) {
                    var masu = new Masu(r, c);
                    if (masu.ishi() == ISHI_NONE) {   // 石が置かれていない場合
                        var count = masu.set(this.ishi).roundReverse(false);
                        if (count > 0) {  // 反転できる場合
                            possibleMoves.push({ r: r, c: c });  // 有効な手として追加
                        }
                        masu.remove();  // 一時的な設定を元に戻す
                    }
                }
            }
            if (possibleMoves.length > 0) { // 有効な手がある場合
                // 角のマスが有効な手の中にあるかチェック
                for (var i = 0; i < possibleMoves.length; i++) {
                    if (this.isCornerMove(possibleMoves[i].r, possibleMoves[i].c)) {
                         // 角のマスに石を置いて反転する
                        new Masu(possibleMoves[i].r, possibleMoves[i].c).set(this.ishi).roundReverse(true);
                        intermediate_end = 0;
                        return; // 角に置けたらターン終了
                    }
                }
                // ランダムに有効な手を選択して石を置き、反転する
                var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                new Masu(randomMove.r, randomMove.c).set(this.ishi).roundReverse(true);
                intermediate_end = 0;
            } else {
                // 有効な手がない場合はパス
                    alert("CPUがパスしました。");
                    intermediate_end += 1;
            }
    }
    // 角のマスかどうかをチェックする関数
    isCornerMove(r, c) {
        return (r == 0 && c == 0) ||
               (r == 0 && c == 7) ||
               (r == 7 && c == 0) ||
               (r == 7 && c == 7);
    }
}

