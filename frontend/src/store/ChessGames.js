import {observable, computed, action, decorate} from 'mobx';

class ChessGames {
    games = [];
    game = null;
    boardOrientation = "white";
    table_games_cache = {};

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    flipBoard = () => {
        this.boardOrientation = this.boardOrientation === "white" ? "black" : "white";
    }

    getGameByUrl(url) {
        // "/api/games/"

        for (let obj of Object.values(this.table_games_cache)) {
            for (let game of obj) {
                if (game.url === url) {
                    this.game = game;
                    return
                }
            }
        }

        fetch("/api/game/",
            {
                method: "POST",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({
                    url: url,
                })
            }).then(response => {
            if (!response.ok) {
                throw new Error('Something went wrong ...');
            }
            return response.json();
        }).then((data) => {
            this.game = data.game
        }).catch(() => {
            this.game = null
        });
    }


    resetStoredGame() {
        this.game = null;
    }

    getGames(filters) {
        this.games = []

        if (filters.white + filters.black + filters.ignore in this.table_games_cache) {
            this.games = this.table_games_cache[filters.white + filters.black + filters.ignore]
        } else {

            fetch("/api/games/",
                {
                    method: "POST",
                    headers: {'Content-Type': "application/json"},
                    body: JSON.stringify({
                        white: filters.white,
                        black: filters.black,
                        ignore: filters.ignore ? '1' : ''
                    })
                }).then(response => {
                if (!response.ok) {
                    throw new Error('Something went wrong ...');
                }
                return response.json();
            }).then(data => {
                this.games = data.games
                this.table_games_cache[filters.white + filters.black + filters.ignore] = data.games
            })
        }

    }

}

decorate(ChessGames, {
        games: observable,
        game: observable,
        getByUrl: action,
        resetStoredGame: action,
        getGames: action,
        boardOrientation: observable,
        flipBoard: action,
        table_games_cache: observable
    }
);

export default ChessGames;