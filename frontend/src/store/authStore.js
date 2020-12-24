import {observable, computed, action, decorate} from 'mobx';

class AuthStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    inProgress = false;
    errors = undefined;
    currentUser = undefined;

    values = {username: '', password: '', email: ''}
    reset = () => this.values = {username: '', password: '', email: ''}

    setUsername = (value) => this.values.username = value;
    setEmail = (value) => this.values.email = value;
    setPassword = (value) => this.values.password = value;

    async login() {
        this.inProgress = true;
        this.errors = undefined;
        try {
            this.currentUser = await this.rootStore.api.Auth.login(this.values.username, this.values.password)
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
            this.currentUser = await this.rootStore.api.Auth.login(this.values.username, this.values.password)
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(e)
        } finally {
            this.inProgress = false;
        }
    }

    refresh = () => {
        return this.rootStore.api.Auth.refresh().then(data => {
            this.currentUser = data;
        }).catch(console.log)
    }

    logout = () => {
        this.rootStore.api.Auth.logout().then(data => this.currentUser = undefined).catch(console.log)
    }

}

decorate(AuthStore, {
        inProgress: observable,
        errors: observable,
        values: observable,
        currentUser: observable,

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