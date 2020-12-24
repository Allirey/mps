import {observable, computed, action, decorate} from 'mobx';

class AuthStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    inProgress = false;
    errors = undefined;
    currentUser = undefined;
    isAuthenticated = false;

    values = {username: '', password: '', email: ''}
    reset = () => this.values = {username: '', password: '', email: ''}

    setUsername = (value) => this.values.username = value;
    setEmail = (value) => this.values.email = value;
    setPassword = (value) => this.values.password = value;

    async login() {
        this.inProgress = true;
        this.errors = undefined;
        try {
            let data = await this.rootStore.api.Auth.login(this.values.username, this.values.password)
            if (!data.authenticated) {
                this.isAuthenticated = false;
                return data
            }
            this.rootStore.api.token = data.access
            this.currentUser = JSON.parse(atob(data.access.split('.')[1]));
            this.isAuthenticated = true;
            return Promise.resolve()
        } catch (e) {
            // console.log(e)
            return Promise.reject(e)
        } finally {
            this.inProgress = false;
        }
    }

    async register() {
        this.inProgress = true;
        this.errors = undefined;
        try {
            await this.rootStore.api.Auth.register(...this.values)

            //todo call login separately
            let data = await this.rootStore.api.Auth.login(this.values.username, this.values.password)
            if (!data.authenticated) {
                this.isAuthenticated = false;
                throw data
            }
            this.rootStore.api.token = data.access
            this.currentUser = JSON.parse(atob(data.access.split('.')[1]));
            this.isAuthenticated = true;
            return Promise.resolve()
        }
        finally {
            this.inProgress = false;
        }
    }

    refresh = () => {
        return this.rootStore.api.Auth.refresh().then((data) => {
            if (!data.authenticated) {
                this.isAuthenticated = false;
                throw data
            }
            this.rootStore.api.token = data.access
            this.currentUser = JSON.parse(atob(data.access.split('.')[1]));
            this.isAuthenticated = true;
        }).catch(console.log)
    }

    logout = () => {
        return this.rootStore.api.Auth.logout().then(data => {
            this.currentUser = undefined
            this.isAuthenticated = false;
        }).catch(console.log)
    }
}

decorate(AuthStore, {
        inProgress: observable,
        errors: observable,
        values: observable,
        currentUser: observable,
        isAuthenticated: observable,

        setUsername: action,
        setEmail: action,
        setPassword: action,
        login: action,
        register: action,
        logout: action,
        refresh: action,
    }
);

export default AuthStore;