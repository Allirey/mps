import {observable, computed, action, decorate} from 'mobx';

// const dev_api = '';
const dev_api = 'http://10.10.86.217:8000';
const apiBase = dev_api + '/api';

const apiLogin = apiBase + '/token/obtain/';
const apiRegister = apiBase + '/users/create/';
const apiRefresh = apiBase + '/token/refresh/';
const apiLogout = apiBase + '/token/refresh/remove/';

const apiGame = apiBase + '/game/';
const apiExplorer = apiBase + '/explorer/';
const apiSearchAutocomplete = apiBase + '/autocomplete/';

const apiQuizyWords = apiBase + '/quizy/words/'

class api {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    token = null;

    Auth = {
        register: (username, email, password) => {
            return this.makeRequest(apiRegister, {
                body: JSON.stringify({username, password, email})
            })
        },
        login: (username, password) => {
            return this.makeRequest(apiLogin, {
                body: JSON.stringify({username, password})
            })
        },
        logout: () => (
            this.makeRequest(apiLogout).then(data => (this.token = undefined))
        ),
        refresh: () => {
            return this.makeRequest(apiRefresh)
        },
    }

    ChessExplorer = {
        getGameByUrl: (id) => {
        },
        getGamesAndMoves: (name, color, fen) => {
        },
        playerSearchAutocomplete: () => {
        }
    }

    Quizy = {
        add: (word, translate) => {
        },
        update: (word, translate) => {
        },
        getWordList: () => {
        },
        remove: (word) => {
        }
    }

    makeRequest(url, Params = {}, withCreds = false) {
        return fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json',},
            credentials: 'include',
            ...this.authHeader(withCreds),
            ...Params
        }).then(response => {
            if (response.ok) return response.json();
            return response.json().then(data => {
                throw data;
            });
        })
    }

    authHeader = (withCreds = false) => {
        if (this.rootStore.authStore.currentUser && this.token && withCreds) {
            return {Authorization: `Bearer ${this.token}`};
        } else {
            return {};
        }
    }
}

decorate(api, {
        token: observable,
        appLoaded: observable,
    }
);

export default api;