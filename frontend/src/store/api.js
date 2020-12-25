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

const apiQuizyWords = apiBase + '/quizy/words/'

class api {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    token = null;

    Auth = {
        register: (username, email, password) => (
            this.requests.post(apiRegister, {body: JSON.stringify({username, password, email})})
        ),
        login: (username, password) => (
            this.requests.post(apiLogin, {body: JSON.stringify({username, password})})
        ),
        logout: () => (this.requests.post(apiLogout).then(data => (this.token = undefined))),
        refresh: () => (this.requests.post(apiRefresh)),
    }

    ChessExplorer = {
        getGameByUrl: (url) => (this.requests.get(apiGame + '?' + new URLSearchParams({id: url}))),
        getGamesAndMoves: (name, color, fen) => (
            this.requests.get(apiExplorer + '?' + new URLSearchParams({name, color, fen}))
        ),
        playerSearchAutocomplete: () => {
        }
    }

    Quizy = {
        add: (word, translate) => (
            this.requests.post(apiQuizyWords, {body: JSON.stringify({word, translate})})
        ),
        update: (id, word, translate) => (
            this.requests.put(apiQuizyWords + `${id}/`, {body: JSON.stringify({word, translate})})
        ),
        getWordList: () => (this.requests.get(apiQuizyWords)),
        remove: (id) => (this.requests.delete(apiQuizyWords + `${id}/`))
    }


    // wrap on fetch: requests.METHOD_NAME(URL, OPTIONS, WITH_AUTH)
    requests = Object.assign(...Object.entries(
        {get: "GET", post: "POST", put: "PUT", delete: "DELETE", patch: "PATCH"}).map(([key, method]) => ({
            [key]: (url, options = {}, withAuth = false) => this.request(url, method, options, withAuth)
        })));

    request(url, method, options = {}, withAuth = false) {
        /* todo check if 401 - make refresh, then repeat request,
        if 401 again - throw 401 error + data, else return data. */

        return fetch(url, {
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json',},
            credentials: 'include',
            ...this.authHeader(withAuth),
            ...options,
            method: method,
        }).then(response => {
            if (response.ok) return response.json();
            return response.json().then(data => {
                throw data;
            });
        })
    }

    authHeader = (withAuth = false) => {
        if (this.rootStore.authStore.currentUser && this.token && withAuth) {
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