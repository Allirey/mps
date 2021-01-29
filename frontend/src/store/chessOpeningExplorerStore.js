import {observable, computed, action, decorate} from 'mobx';

class ChessOpeningExplorerStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
   }

   searchData = {
      name: '', color: "w", fen: typeof this.rootStore === "undefined" ?
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : this.rootStore.chessNotation.fen
   };
   lastSearchQuery = {...this.searchData};
   table_games_cache = {};
   explorer_moves_cache = {};
   pgn_games_cache = {};
   inProgress = false;

   setName = (name) => this.searchData.name = name;
   setColor = (color) => this.searchData.color = color;

   getGameByUrl = (url) => {
      if (url in this.pgn_games_cache) {
         this.rootStore.chessNotation.loadGame(this.pgn_games_cache[url])
      } else {
         // this.inProgress = true
         this.rootStore.api.ChessExplorer.getGameByUrl(url).then((data) => {
            this.pgn_games_cache[url] = data.game;
            this.rootStore.chessNotation.loadGame(this.pgn_games_cache[url])
         })
           // .finally(() => this.inProgress = false);
      }
   }

   searchGames = () => {
      // to prevent search spam on server api
      if (this.searchData.name.length < 3 ||
        JSON.stringify(this.searchData) === JSON.stringify(this.lastSearchQuery)) return;
      else this.lastSearchQuery = {...this.searchData};

      const check = JSON.stringify(this.searchData);

      if (!(check in this.table_games_cache)) {
         const {name, color, fen} = this.searchData
         this.inProgress = true
         this.rootStore.api.ChessExplorer.getGamesAndMoves(name, color, fen).then(data => {
            this.table_games_cache[check] = data.games;
            this.explorer_moves_cache[check] = data.moves;
         }).catch(console.log).finally(()=> this.inProgress = false)
      }
      // reset current board game when searching another player's game
      // this.rootStore.chessNotation.resetNode();
   };

   get currentMoves() {
      return JSON.stringify(this.searchData) in this.explorer_moves_cache ?
        this.explorer_moves_cache[JSON.stringify(this.searchData)] : [];
   }

   get currentGames() {
      return JSON.stringify(this.searchData) in this.table_games_cache ?
        this.table_games_cache[JSON.stringify(this.searchData)] : [];
   }
}

decorate(ChessOpeningExplorerStore, {
     searchData: observable,
     explorer_moves_cache: observable,
     table_games_cache: observable,
     inProgress: observable,

   // setColor:action,
   // setName:action,

     currentMoves: computed,
     currentGames: computed,
  }
);

export default ChessOpeningExplorerStore;