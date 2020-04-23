import {observable, computed, action, decorate} from 'mobx';
import Chess from 'chess.js'

const dev_api = 'http://10.10.86.217:8000';
const base_api = dev_api + '/api';
const api_game = base_api + '/game/';
const api_games = base_api + '/games/';

class AnalysisStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    searchData = {name: '', color: "white"};
    lastSearchQuery = {...this.searchData};

    game = null;
    games = [];

    table_games_cache = {};
    bookData = [];

    chessGame = new Chess();

    setName = (name) => this.searchData.name = name;
    setColor = (color) => this.searchData.color = color;

    getGameByUrl = (url) => {
        for (let obj of Object.values(this.table_games_cache)) {
            for (let game of obj) {
                if (game.url === url) {
                    this.game = game;
                    return
                }
            }
        }
        this.makePostRequest(api_game, {url}).then((data) => {
            this.game = data.game
        }).catch(() => {
            this.game = null
        });
    };

    makePostRequest(url, body) {
        return fetch(url, {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(body)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Something went wrong ...');
            }
            return response.json();
        })
    }

    searchGames = () => {
        // to prevent search spam on server api
        if (JSON.stringify(this.searchData) === JSON.stringify(this.lastSearchQuery)) return;
        else this.lastSearchQuery = {...this.searchData};

        this.games = [];

        if (JSON.stringify(this.searchData) in this.table_games_cache) {
            this.games = this.table_games_cache[JSON.stringify(this.searchData)]
        } else {
            this.makePostRequest(api_games, {
                white: '',
                black: '',
                ignore: '',
                [this.searchData.color]: this.searchData.name
            })
                .then(data => {
                    this.games = data.games;
                    this.table_games_cache[JSON.stringify(this.searchData)] = data.games;
                    this.bookData = this.movesTree()
                }).catch(() => (console.log('privet')))
        }

        // reset current board game when searching another player's game
        this.rootStore.chessNotation.resetNode();
    };

    movesTree = () => {
        const processGames = this.games.length === 0 ? null : this.games.map((game, i) => {
            let moves = game.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' ').slice(0, this.games.length < 100 ? 24 : (this.games.length < 200 ? 20 : 16))
                .filter(value => !['1-0', '0-1', '1/2-1/2'].includes(value));
            return {
                id: game.id,
                result: game.result,
                moves: moves.join(' '),
                date: parseInt(game.date.split('.')[0]),
                url: game.url
            }
        }).filter(value => value.moves !== '');

        console.log('hi')
        console.log(processGames)
        if (!processGames) return null;

        let chessManager = new Chess();

        let moveExplorer = [{
            fen: chessManager.fen(),
            children: [],
            gameUrls: []
        }];

        let resultsMap = {
            '1-0': 1,
            '0-1': 0,
            '1/2-1/2': 0.5
        };

        processGames.forEach((game, i) => {
            let currentFen = chessManager.fen();
            // let root = moveExplorer[0];

            let moves = game.moves.split(' ');
            moves.forEach((move, i) => {
                let child = {
                    san: move,
                    games: 1,
                    result: resultsMap[game.result],
                    date: game.date
                };

                if (!moveExplorer.find(node => node.fen === currentFen)) {
                    moveExplorer.push({
                        fen: currentFen,
                        children: [child],
                        gameUrls: [game.url]
                    })
                } else {
                    let node = moveExplorer.find(node => node.fen === currentFen);
                    let nodeChild = node.children.find(child => child.san === move);

                    if (!!nodeChild) {
                        nodeChild.games++;
                        nodeChild.result += resultsMap[game.result];
                        nodeChild.date = Math.max(nodeChild.date, game.date);
                    } else {
                        node.children.push(child);
                        node.gameUrls.push(game.url);
                    }

                    if (!node.gameUrls.includes(game.url)) node.gameUrls.push(game.url);
                }
                chessManager.move(move);
                currentFen = chessManager.fen();
            });
            chessManager.reset()
        });

        moveExplorer.forEach(node => {
            node.children.sort((a, b) => a.games < b.games ? 1 : -1);
        });
        console.log(moveExplorer.length);
        console.log(JSON.stringify(moveExplorer).length);

        return moveExplorer
    };

    get analysisMovesTree() {
        // {move: 'e4', gamesCount: 32, score: '20%', lastPlayed: 2019},

        if (this.bookData === null || typeof this.rootStore.chessNotation.node === "undefined") return [];

        let tree = this.bookData.find(node => node.fen === this.rootStore.chessNotation.node.fen);
        return !!tree ? tree.children.map(child => {
            return {
                move: child.san,
                lastPlayed: child.date,
                score: (Math.round(child.result / child.games * 100)).toString() + '%',
                gamesCount: child.games
            }
        }) : [];
    }

    get gamesByCurrentFen() {
        if (this.bookData === null || typeof this.rootStore.chessNotation.node === "undefined") return [];
        let node = this.bookData.find(node => node.fen === this.rootStore.chessNotation.node.fen);
        return !node ? [] : this.games.filter(game => node.gameUrls.includes(game.url));
    }

    toNext = () => {
        if (this.currentPly < this.notation.length) {
            let move = this.chessGame.move(this.notation[this.currentPly], {sloppy: true});
            this.currentPly++;
            this.lastMove = move ? [move.from, move.to] : [null, null];
        }
    };

    toPrev = () => {
        if (this.currentPly > 0) {
            this.chessGame.undo();
            let move = null;
            if (this.chessGame.history({verbose: true}).length > 0) {
                move = this.chessGame.history({verbose: true})[this.chessGame.history().length - 1]
            }
            this.currentPly--;
            this.lastMove = move ? [move.from, move.to] : [null, null];
        }
    };

    toFirst = () => {
        this.chessGame.reset();
        this.currentPly = 0;
        this.lastMove = [null, null];
    };

    toLast = () => {
        let move = null;
        let index = this.currentPly;
        while (index < this.notation.length) {
            move = this.chessGame.move(this.notation[index], {sloppy: true});
            index++;
        }
        this.currentPly = this.notation.length;
        this.lastMove = move ? [move.from, move.to] : [null, null];
    };

    calcMovable = () => {
        const dests = {};
        this.chessGame.SQUARES.forEach(s => {
            const ms = this.chessGame.moves({square: s, verbose: true});
            if (ms.length) dests[s] = ms.map(m => m.to)
        });
        return {
            free: false,
            dests,
            color: this.turnColor()
        }
    };

    turnColor = () => {
        return this.chessGame.turn() === "w" ? "white" : "black"
    };

    onMove = (from, to) => {
        this.notation = this.notation.slice(0, this.currentPly);
        let m = this.chessGame.move({from: from, to: to});
        this.notation.push(m.san);
        this.currentPly++;
        this.lastMove = m ? [m.from, m.to] : [null, null];
    };

    gameByUrl = (url) => {
        return this.games.find(game => game.url === url);
    }
}

decorate(AnalysisStore, {
        games: observable,
        bookData: observable,
        // game: observable,
        // table_games_cache: observable,
        searchData: observable,
        // chessGame: observable,

        getByUrl: action,
        resetStoredGame: action,
        toFirst: action,
        toLast: action,
        toNext: action,
        toPrev: action,

        gameByUrl: action,

        calcMovable: action,
        turnColor: action,
        onMove: action,
        movesTree: action,

        gamesByCurrentFen: computed,
        analysisMovesTree: computed,
    }
);

export default AnalysisStore;