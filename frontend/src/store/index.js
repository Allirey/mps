import chessNotation from './notationStore';
import chessOpeningExplorer from './chessOpeningExplorerStore';

class RootStore{
    constructor(){
        this.storage = localStorage;
        this.chessNotation = new chessNotation(this);
        this.chessOpeningExplorer = new chessOpeningExplorer(this);
    }
}

export default new RootStore();