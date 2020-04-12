import chessStore from './chessStore';
import analysisStore from './analysisStore';
import chessNotation from './notationStore';

class RootStore{
    constructor(){
        this.storage = localStorage;
        this.chess = new chessStore(this);
        this.chessAnalysis = new analysisStore(this);
        this.chessNotation = new chessNotation(this);
    }
}

export default new RootStore();