import {observable, computed, action, decorate} from 'mobx';

class ChessGames {
    games = [];
    game = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    getByUrl(url) {
        // "/api/games/"
        let game = fetch("/api/game/",
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
        // return this.game
    }

    resetStoredGame() {
        this.game = null;
    }
}

decorate(ChessGames, {
        games: observable,
        game: observable,
        getByUrl: action,
        resetStoredGame: action,
    }
);


export default ChessGames;