import {observable, computed, action, decorate} from 'mobx';

const dev_api = '';
// const dev_api = 'http://10.10.86.217:8000';
const apiBase = dev_api + '/api';

const apiLogin = apiBase + '/token/obtain/';
const apiRegister = apiBase + '/users/create/';
const apiRefresh = apiBase + '/token/refresh/';
const apiLogout = apiBase + '/token/refresh/remove/';

const apiGame = apiBase + '/game/';
const apiExplorer = apiBase + '/explorer/';
const apiSearchAutocomplete = apiBase + '/autocomplete/';


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
            }).then((data) => {
                if (data.code === 401) {
                    throw new Error('unregistered user')
                }
                if (data.code !== 200) {
                    throw new Error('unknown error')
                }

                this.token = data.access
                return JSON.parse(atob(data.access.split('.')[1]));
            })
        },
        logout: () => (
            this.makeRequest(apiLogout).then(data => (this.token = undefined))
        ),
        refresh: () => {
            return this.makeRequest(apiRefresh).then((data) => {
                if (data.code === 401) {
                    throw new Error('unregistered user')
                }
                if (data.code !== 200) {
                    throw new Error('unknown error')
                }

                this.token = data.access
                return JSON.parse(atob(data.access.split('.')[1]));
            })
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
                throw {status: response.status, message: data};
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
    }
);

export default api;