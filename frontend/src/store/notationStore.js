import {observable, computed, action, decorate} from 'mobx';
import Chess from 'chess.js'

class NotationStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    chessGame = new Chess();

    node = {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        ply: 0,
        san: '',
        uci: {from: null, to: null},
    };

    mainLineNodes = [];
    boardOrientation = "white";

    initMainLineNodes = (url) => {
        this.resetNode();

        let game = this.rootStore.chessAnalysis.gameByUrl(url);

        let tmp = game.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' ');
        tmp = tmp.slice(0, tmp.length - 2);

        this.mainLineNodes = tmp.map((srcMove, i) => {
            let move = this.chessGame.move(srcMove);
            return {
                fen: this.chessGame.fen(),
                san: move.san,
                ply: i,
                uci: {from: move.from, to: move.to}
            }
        });
    };

    flipBoard = () => this.boardOrientation = this.boardOrientation === "white" ? "black" : "white";

    jumpToNode(index) {
        let currentIndex = this.mainLineNodes.findIndex((obj) => obj === this.node, this.node);
        let newIndex = currentIndex + index;
        if (newIndex < 0 || this.mainLineNodes.length === 0) {
            this.node = {
                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                ply: 0,
                san: '',
                uci: {from: null, to: null},
            };
        } else {
            this.node = this.mainLineNodes[Math.min(newIndex, this.mainLineNodes.length - 1)]
        }
    }

    get lastMove() {
        return typeof this.node === "undefined" || this.node.uci.from === null ? [] : [this.node.uci.from, this.node.uci.to];
    }

    get fen() {
        return typeof this.node === "undefined" ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : this.node.fen;
    }

    jumpToMove = (index) => {
        this.node = this.mainLineNodes[index]
    };

    toNext = () => {
        this.jumpToNode(1)
    };

    toPrev = () => {
        this.jumpToNode(-1)
    };

    toFirst = () => {
        this.jumpToNode(-1000)
    };

    toLast = () => {
        this.jumpToNode(this.mainLineNodes.length - this.mainLineNodes.findIndex((obj) => obj === this.node, this.node) - 1)
    };

    resetNode = () => {
        this.mainLineNodes = [];
        this.chessGame.reset();
        this.node = {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            ply: 0,
            san: '',
            uci: {from: null, to: null},
        };
    }
}

decorate(NotationStore, {
        node: observable,
        mainLineNodes: observable,
        boardOrientation: observable,

        initMainLineNodes: action,
        flipBoard: action,
        jumpToMove: action,
        toNext: action,
        toPrev: action,
        toFirst: action,
        toLast: action,
        resetNode: action,

        lastMove: computed,
        fen: computed,
    }
);

export default NotationStore;