import {makeAutoObservable} from 'mobx';

const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

class ChessOpeningExplorerStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
      let db = this.rootStore.storage.getItem('chessdb')
      this.currentDB = Object.values(DATABASES).includes(db)? db : DATABASES.MASTERS
      makeAutoObservable(this)
   }

   searchData = {name: '', color: "w", fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'};
   inProgress = false;
   explorerCache = {[DATABASES.UKR]: {}, [DATABASES.LICHESS]: {}, [DATABASES.MASTERS]: {}}

   setName = (name) => this.searchData.name = name;
   setColor = (color) => this.searchData.color = color;

   setDatabase = (db) => {
      if (!Object.values(DATABASES).includes(db)) return

      this.currentDB = db
      this.getExplorerData()
      this.rootStore.storage.setItem('chessdb', db)
   }

   getGame(db, url) {
      if (db === 'u') {
         return this.rootStore.api.ChessExplorer.getGameUkr(url).then((data) => {
            this.rootStore.chessNotation.loadGame(data.game);
         })

      } else if (db === 'lc') {
         return this.rootStore.api.ChessExplorer.getGameLichess(url).then((data) => {
            this.rootStore.chessNotation.loadGame(data.pgn);
         })
      }

      return Promise.reject()
   }

   getExplorerData() {
      if (this.currentDB === DATABASES.UKR) {
         const check = JSON.stringify(this.searchData);
         if (this.searchData.name.length < 3 || check in this.explorerCache[DATABASES.UKR]) return;

         this.inProgress = true
         const {name, color, fen} = this.searchData
         this.rootStore.api.ChessExplorer.explorerUkr(name, color, fen).then(data => { // {moves, games}
            this.explorerCache[this.currentDB][check] = data
         }).catch(console.log).finally(() => this.inProgress = false)

      } else if ([DATABASES.MASTERS, DATABASES.LICHESS].includes(this.currentDB)) {
         const {fen} = this.searchData
         if (fen in this.explorerCache[this.currentDB]) return

         const API = {
            [DATABASES.MASTERS]: this.rootStore.api.ChessExplorer.explorerLichessMaster,
            [DATABASES.LICHESS]: this.rootStore.api.ChessExplorer.explorerLichess,
         }

         this.inProgress = true
         API[this.currentDB](fen).then(data => {
            const moves = data.moves.map(({san, white, draws, black}) => {
               return {white, draw: draws, black, san, date: '?'}
            })
            const games = data.topGames.map(game => {
               return {
                  white: game.white.name,
                  whiteelo: game.white.rating,
                  black: game.black.name,
                  blackelo: game.black.rating,
                  url: game.id,
                  result: game.winner === 'white' ? 1 : game.winner === 'black' ? 0 : 0.5,
                  date: `${game.year}`
               }
            })
            this.explorerCache[this.currentDB][fen] = {games, moves}

         }).catch(console.log).finally(() => this.inProgress = false)
      }
   }

   get explorerData() {
      let filter = this.currentDB === DATABASES.UKR ? JSON.stringify(this.searchData) : this.searchData.fen
      return this.explorerCache[this.currentDB][filter] || {games: [], moves: []}
   }
}

export default ChessOpeningExplorerStore;