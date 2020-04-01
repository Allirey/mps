import chessStore from './chessStore';

class RootStore{
    constructor(){
        this.storage = localStorage;
        this.chess = new chessStore(this);
    }
}

export default new RootStore();