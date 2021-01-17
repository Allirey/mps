import {observable, computed, action, decorate} from 'mobx';

const dev_api = '';
// const dev_api = 'http://10.10.86.217:8000';
const apiBase = dev_api + '/api';

const apiRegister = apiBase + '/users/create/';
const apiPublicUser = apiBase + '/users/';
const apiUsers = apiBase + '/users/admin/';
const apiActivation = apiBase + '/users/activate/';
const apiForgotPassword = apiBase + '/users/forgot-password/';

const apiLogin = apiBase + '/token/obtain/';
const apiRefresh = apiBase + '/token/refresh/';
const apiLogout = apiBase + '/token/refresh/remove/';

const apiChangePassword = apiBase + '/users/change-password/';

const apiGame = apiBase + '/game/';
const apiExplorer = apiBase + '/explorer/';
const apiSearchAutocomplete = apiBase + '/autocomplete/';

const apiArticles = apiBase + '/blog/'

class api {
   constructor(rootStore) {
      this.rootStore = rootStore;
   }

   token = null;

   Auth = {
      register: (username, email, password) =>
        this.requests.post(apiRegister, {body: JSON.stringify({username, password, email})}),
      getUser: (username) => this.requests.get(`${apiPublicUser}${username}/`),
      editUserData: (username, data) => this.requests.patch(`${apiPublicUser}${username}/`,
        {body: JSON.stringify(data)}, true),
      login: (username, password) => this.requests.post(apiLogin, {body: JSON.stringify({username, password})}),
      logout: () => this.baseReq(apiLogout, 'POST', {}, false).then(data => {
         this.token = undefined;
         return data;
      }),
      refresh: () => this.baseReq(apiRefresh, 'POST', {}, false),
      activate: (id, token) => this.requests.get(`${apiActivation}${id}/${token}/`),
      changePassword: (old_password, password, password2) => this.requests.put(apiChangePassword, {
         body: JSON.stringify({old_password, password, password2})
      }, true),
      passwordResetRequest: email => this.requests.post(apiForgotPassword, {body: JSON.stringify({email})}),
      passwordResetChange: (id, token, password, password2) => this.requests
        .post(`${apiForgotPassword}${id}/${token}/`, {body: JSON.stringify({id, token, password, password2})}),
   }

   Admin = {
      createUser: (data) => this.requests.post(apiUsers, {body: JSON.stringify(data)}, true),
      updateUser: (id, data) => this.requests.put(`${apiUsers}${id}`, {body: JSON.stringify(data)}, true),
      deleteUser: (id) => this.requests.delete(`${apiUsers}${id}`, {}, true),
      getUser: (id) => this.requests.get(`${apiUsers}${id}`, {}, true),
      getUsers: () => this.requests.get(apiUsers, {}, true),
      patchUser: (id, data) => this.requests.patch(`${apiUsers}${id}`, {body: JSON.stringify(data)}, true),
   }

   ChessExplorer = {
      getGameByUrl: (url) => this.requests.get(apiGame + '?' + new URLSearchParams({id: url})),
      getGamesAndMoves: (name, color, fen) => (
        this.requests.get(apiExplorer + '?' + new URLSearchParams({name, color, fen}), {}, true)
      ),
      playerSearchAutocomplete: (name) =>
        (this.requests.get(apiSearchAutocomplete + '?' + new URLSearchParams({name}))
        )
   }

   Posts = {
      create: (slug, title, body) => this.requests.post(apiArticles, {body: JSON.stringify({slug, title, body})}, true),
      retrieve: (id) => this.requests.get(`${apiArticles}${id}/`),
      update: (id, data) => this.requests.put(`${apiArticles}${id}/`, {body: JSON.stringify({...data})}, true),
      patch: (id, data) => this.requests.patch(`${apiArticles}${id}/`, {body: JSON.stringify({...data})}, true),
      delete: (id) => this.requests.delete(`${apiArticles}${id}/`, {}, true),
      list: () => this.requests.get(apiArticles),
      listPage: (page) => this.requests.get(apiArticles + '?' + new URLSearchParams({page})),
   }

   // wrap on fetch: requests.METHOD_NAME(URL, OPTIONS, WITH_AUTH)
   requests = Object.assign(...Object.entries(
     {get: "GET", post: "POST", put: "PUT", delete: "DELETE", patch: "PATCH"}).map(([key, method]) => ({
      [key]: (url, options = {}, withAuth = false) => this.request(url, method, options, withAuth)
   })));

   baseReq(url, method, options, withAuth) {
      return fetch(url, {
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...this.authHeader(withAuth)
         },
         credentials: 'include',
         ...options,
         method: method,
      }).then(response => {

          if (response.status >= 200 && response.status < 300 && response.status !== 204) {
            return response.json();
         }else if (response.status === 204){
            return {"message": "No Content"}
         }

         return response.json().then(json => {
            throw {status: response.status, message: json};
         });
      });
   }

   refreshPromise = null;

   async request(url, method, options = {}, withAuth = false, recLevel = 0) {
      //  todo  sync backend and frontend response.status , not response code, and data
      if (recLevel > 1) {
         throw {status: 403, message: 'RT storage error in refreshing process'};
      }
      try {
         return await this.baseReq(url, method, options, withAuth)
      } catch (e) {
         if (e.status !== 401 || !this.rootStore.authStore.isAuthenticated) {
            throw e;
         }

         if (this.refreshPromise === null) {
            this.refreshPromise = this.Auth.refresh();
         }

         let refreshResponse = await this.refreshPromise

         setTimeout(() => {
            this.refreshPromise = null
         }, 10000);

         if (refreshResponse.authenticated) {
            this.token = refreshResponse.access
            this.rootStore.authStore.isAuthenticated = true;
            this.rootStore.authStore.currentUser = JSON.parse(atob(refreshResponse.access.split('.')[1]));

            return this.request(url, method, options, withAuth, recLevel + 1)

         } else {
            this.rootStore.authStore.currentUser = undefined
            this.rootStore.authStore.isAuthenticated = false;
            this.token = null
            this.Auth.logout()

            throw refreshResponse
         }
      }
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
     refreshPromise: observable,
     request: action,
  }
);

export default api;