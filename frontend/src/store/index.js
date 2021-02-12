import chessNotation from './notationStore';
import chessOpeningExplorer from './chessOpeningExplorerStore';
import authStore from './authStore';
import api from "./api";
import notification from "./notificationStore";
import posts from "./postsStore";
import openings from './chessOpeningStore';

class RootStore{
    constructor(){
        this.storage = localStorage;
        this.api = new api(this);
        this.chessNotation = new chessNotation(this);
        this.chessOpeningExplorer = new chessOpeningExplorer(this);
        this.authStore = new authStore(this);
        this.notifications = new notification(this);
        this.posts = new posts(this);
        this.openings = new openings(this);
    }
}

export default new RootStore();