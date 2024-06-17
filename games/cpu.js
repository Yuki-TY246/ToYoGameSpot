class Masu {
    constructor(r, c) {
        r = parseInt(r);
        c = parseInt(c);
        if (r < 0 || r >= 8 || c < 0 || c >= 8) throw 'out of board';
        this.r = r;
        this.c = c;
        this.id = 'r' + r + 'c' + c;
        this.td = $('#' + this.id);
    }

    ishi() {
        var div = $('div', this.td);
        return div.hasClass('black') ? ISHI_BLACK : (div.hasClass('white') ? ISHI_WHITE : ISHI_NONE);
    }

    set(ishi) {
        var div = $('div', this.td); // クラスを変更するdiv要素を取得
        if (ISHI_NONE == this.ishi()) { // 石が置かれていないとき
            div.removeClass('none');
        } else { // 挟んだ石をひっくり返す
            div.removeClass(ishi == ISHI_BLACK ? 'white' : 'black');
        }
        div.addClass(ishi == ISHI_BLACK ? 'black' : 'white');
        return this;
    }

    remove() {
        $('div', this.td).removeClass('white').removeClass('black').addClass('none');
        return this;
    }

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

    reverse(count, a0, dr, dc, exec) {
        try {
            var neighbor = new Masu(this.r + dr, this.c + dc);

            if (ISHI_NONE == neighbor.ishi()) return 0;
            if (a0.ishi() != neighbor.ishi()) count = neighbor.reverse(count + 1, a0, dr, dc, exec);

            if (exec && count > 0) {
                this.set(a0.ishi());
            }
            return count;

        } catch (e) {
            return 0;
        }
    }
}

class CPU {
    constructor(ishi) {
        this.ishi = ishi;
    }

    playTurn() {
        setTimeout(() => {
            var possibleMoves = [];

            for (var r = 0; r < 8; r++) {
                for (var c = 0; c < 8; c++) {
                    var masu = new Masu(r, c);
                    if (masu.ishi() == ISHI_NONE) {
                        var count = masu.set(this.ishi).roundReverse(false);
                        if (count > 0) {
                            possibleMoves.push({ r: r, c: c });
                        }
                        masu.remove();
                    }
                }
            }

            if (possibleMoves.length > 0) {
                for (var i = 0; i < possibleMoves.length; i++) {
                    if (this.isCornerMove(possibleMoves[i].r, possibleMoves[i].c)) {
                        new Masu(possibleMoves[i].r, possibleMoves[i].c).set(this.ishi).roundReverse(true);
                        return;
                    }
                }

                var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                new Masu(randomMove.r, randomMove.c).set(this.ishi).roundReverse(true);
            } else {
                alert("CPUがパスしました。");
                ishi *= -1;
                $('div#status').html((ishi == ISHI_BLACK ? '黒' : 'cpu') + 'の番');
            }
        }, 500); // 500ミリ秒(一秒)の遅延。
    }

    isCornerMove(r, c) {
        return (r == 0 && c == 0) ||
               (r == 0 && c == 7) ||
               (r == 7 && c == 0) ||
               (r == 7 && c == 7);
    }
}
