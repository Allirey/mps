import {observable, computed, action, decorate} from 'mobx';

const dev_api = 'http://localhost:8000';
const base_api = '/api';
const api_game = base_api + '/game/';
const api_games = base_api + '/games/';

class ChessStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    games = [];
    game = null;
    boardOrientation = "white";
    table_games_cache = {};

    searchValues = {
        white: '',
        black: '',
        ignore: false,
    };

    lastSearchQuery = {
        white: '',
        black: '',
        ignore: false,
    };

    setWhite(white) {
        this.searchValues.white = white;
    }

    setBlack(black) {
        this.searchValues.black = black;
    }

    setIgnore(ignore) {
        this.searchValues.ignore = ignore;
    }

    resetSearchValues() {
        this.searchValues.white = '';
        this.searchValues.black = '';
        this.searchValues.ignore = false;
    }

    flipBoard = () => this.boardOrientation = this.boardOrientation === "white" ? "black" : "white";

    getGameByUrl(url) {
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
    }

    resetStoredGame() {
        this.game = null;
    }

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

    searchGames() {
        // to prevent search spam on server api
        if (JSON.stringify(this.searchValues) === JSON.stringify(this.lastSearchQuery)) return;
        else this.lastSearchQuery = {...this.searchValues};

        this.games = [];
        const {white, black, ignore} = this.searchValues;
        if (white + black + ignore in this.table_games_cache) {
            this.games = this.table_games_cache[white + black + ignore]
        } else {
            this.makePostRequest(api_games, {...this.searchValues, ignore: ignore ? '1' : ''})
                .then(data => {
                    this.games = data.games;
                    this.table_games_cache[white + black + ignore] = data.games
                }).catch(() => (console.log('privet')))
        }
    }
}

decorate(ChessStore, {
        games: observable,
        game: observable,
        getByUrl: action,
        resetStoredGame: action,
        searchGames: action,
        boardOrientation: observable,
        flipBoard: action,
        table_games_cache: observable,
        searchValues: observable,

        setWhite: action,
        setBlack: action,
        setIgnore: action,
        resetSearchValues: action,
    }
);

export default ChessStore;