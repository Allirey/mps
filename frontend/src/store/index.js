import { configure } from 'mobx';

import chessStore from './ChessGames';

// configure({ enforceActions: "observed" })

class RootStore{
    constructor(){
        this.storage = localStorage;
        this.chess = new chessStore(this);
    }
}

export default new RootStore();