import {observable, computed, action, decorate} from 'mobx';
import Chess from 'chess.js'

const dev_api = 'http://10.10.86.217:8000';
const base_api = dev_api + '/api';
const api_game = base_api + '/game/';
const api_explorer = base_api + '/explorer/';

class ChessOpeningExplorerStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    searchData = {
        name: '', color: "w", fen: typeof this.rootStore === "undefined" ?
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : this.rootStore.chessNotation.fen
    };
    lastSearchQuery = {...this.searchData};
    game = null;
    table_games_cache = {};
    explorer_moves_cache = {};
    pgn_games_cache = {};

    setName = (name) => this.searchData.name = name;
    setColor = (color) => this.searchData.color = color;

    makeRequest(url, queryParams) {
        return fetch(url + '?' + new URLSearchParams(queryParams), {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if (!response.ok) {
                throw new Error('Something went wrong ...');
            }
            return response.json();
        })
    }

    getGameByUrl = (url) => {
        if (url in this.pgn_games_cache) {
            this.game = this.pgn_games_cache[url];
        } else {
            this.makeRequest(api_game, {id: url}).then((data) => {
                this.game = data.game
                this.pgn_games_cache[url] = data.game;
            }).catch(() => {
                this.game = null
            });
        }
    }

    searchGames = () => {
        // to prevent search spam on server api
        if (JSON.stringify(this.searchData) === JSON.stringify(this.lastSearchQuery)) return;
        else this.lastSearchQuery = {...this.searchData};

        if (!(JSON.stringify(this.searchData) in this.table_games_cache)) {
            this.makeRequest(api_explorer, this.searchData)
                .then(data => {
                    this.table_games_cache[JSON.stringify(this.searchData)] = data.games;
                    this.explorer_moves_cache[JSON.stringify(this.searchData)] = data.moves;
                }).catch(() => (console.log('privet')))
        }
        // reset current board game when searching another player's game
        // this.rootStore.chessNotation.resetNode();
    };

    get currentGame() {
        return typeof this.rootStore.chessNotation.node === "undefined" ? null : this.game
    }

    get currentMoves() {
        return JSON.stringify(this.searchData) in this.explorer_moves_cache ?
            this.explorer_moves_cache[JSON.stringify(this.searchData)] : [];
    }

    get currentGames() {
        return JSON.stringify(this.searchData) in this.table_games_cache ?
            this.table_games_cache[JSON.stringify(this.searchData)] : [];
    }
}

decorate(ChessOpeningExplorerStore, {
        game: observable,
        searchData: observable,
        explorer_moves_cache: observable,
        table_games_cache: observable,

        currentGame: computed,
        currentMoves: computed,
        currentGames: computed,
    }
);

export default ChessOpeningExplorerStore;