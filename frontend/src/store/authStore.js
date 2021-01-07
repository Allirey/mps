import {observable, computed, action, decorate} from 'mobx';

class AuthStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    inProgress = false;
    errors = undefined;
    currentUser = undefined;
    isAuthenticated = false;

    //todo looks weird...
    showSuccessRegister = false;
    showSuccessActivated = false;
    showSuccessPasswordChanged = false;

    values = {username: '', password: '', email: ''}
    reset = () => this.values = {username: '', password: '', email: ''}

    setUsername = (value) => this.values.username = value;
    setEmail = (value) => this.values.email = value;
    setPassword = (value) => this.values.password = value;

    setShowSuccessRegister(value) {
        this.showSuccessRegister = value;
    }

    setShowSuccessActivated(value) {
        this.showSuccessActivated = value;
    }

    setShowSuccessPasswordChanged(value) {
        this.showSuccessPasswordChanged = value;
    }

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

    activate = (id, token) => {
        return this.rootStore.api.Auth.activate(id, token).then(true).catch(false)
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

decorate(AuthStore, {
        inProgress: observable,
        errors: observable,
        values: observable,
        currentUser: observable,
        isAuthenticated: observable,
        showSuccessActivated: observable,
        showSuccessRegister: observable,
        showSuccessPasswordChanged: observable,

        setShowSuccessActivated: action,
        setShowSuccessRegister: action,
        setShowSuccessPasswordChanged: action,

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