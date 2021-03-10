import {makeAutoObservable} from 'mobx';

class AuthStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
      makeAutoObservable(this)
   }

   inProgress = false;
   currentUser = undefined;
   isAuthenticated = false;

   values = {username: '', password: '', email: ''}
   reset = () => this.values = {username: '', password: '', email: ''}

   setUsername = (value) => this.values.username = value;
   setEmail = (value) => this.values.email = value;
   setPassword = (value) => this.values.password = value;

   async login() {
      this.inProgress = true;
      try {
         let data = await this.rootStore.api.Auth.login(this.values.username, this.values.password)
         this._processAuthData(data)

         return Promise.resolve()
      } catch (e) {
         throw e
      } finally {
         this.inProgress = false;
      }
   }

   async register() {
      this.inProgress = true;
      try {
         await this.rootStore.api.Auth.register(this.values.username, this.values.email, this.values.password)

         return Promise.resolve()
      } finally {
         this.inProgress = false;
      }
   }

   async getUser(username) {
      this.inProgress = true;
      try {
         let response = await this.rootStore.api.Auth.getUser(username);
         // todo custom error status from server response
         // if (response.status !== 200) throw response

         return response
      } finally {
         this.inProgress = false;
      }
   }

   async editUserData(data) {
      this.inProgress = true;
      try {
         let response = await this.rootStore.api.Auth.editUserData(this.currentUser.username, data);
         // todo custom error status from server response
         // if (response.status !== 200) throw response

         return response
      } finally {
         this.inProgress = false;
      }
   }

   async activate(id, token) {
      this.inProgress = true;
      try {
         let response = await this.rootStore.api.Auth.activate(id, token)
         if (response.status !== 200) throw response
      } finally {
         this.inProgress = false;
      }

   }

   refresh = () => {
      return this.rootStore.api.Auth.refresh().then((data) => {
         this._processAuthData(data)
      }).catch(console.warn)
   }

   logout = () => {
      return this.rootStore.api.Auth.logout().then(data => {
         this.currentUser = undefined
         this.isAuthenticated = false;
      }).catch(console.warn)
   }

   async changePassword(oldP, newP, newP2) {
      this.inProgress = true;
      try {
         let response = await this.rootStore.api.Auth.changePassword(oldP, newP, newP2)
         this._processAuthData(response)

         return response
      } finally {
         this.inProgress = false;
      }
   }

   async passwordResetRequest(email) {
      this.inProgress = true;
      try {
         let response = await this.rootStore.api.Auth.passwordResetRequest(email)

         if (response.status !== 200) throw response

      } finally {
         this.inProgress = false;
      }
   }

   async passwordResetChange(id, token, password, password2) {
      this.inProgress = true;
      try {
         let response = await this.rootStore.api.Auth.passwordResetChange(id, token, password, password2)

         if (response.status !== 200) throw response

      } finally {
         this.inProgress = false;
      }
   }


   _processAuthData(data) {
      if (!data.authenticated) {
         this.currentUser = undefined
         this.isAuthenticated = false;
         this.rootStore.api.token = null

         throw data
      }
      this.isAuthenticated = true;
      this.rootStore.api.token = data.access
      this.currentUser = JSON.parse(atob(data.access.split('.')[1]));
   }
}

export default AuthStore;