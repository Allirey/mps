import chessNotation from './notationStore';
import chessOpeningExplorer from './chessOpeningExplorerStore';
import authStore from './authStore';
import api from "./api";
import notification from "./notificationStore"

class RootStore{
    constructor(){
        this.storage = localStorage;
        this.api = new api(this);
        this.chessNotation = new chessNotation(this);
        this.chessOpeningExplorer = new chessOpeningExplorer(this);
        this.authStore = new authStore(this);
        this.notifications = new notification(this);
    }
}

export default new RootStore();