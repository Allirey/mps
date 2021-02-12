import {observable, computed, action, decorate} from 'mobx';


class ChessOpeningsStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
   }

   openingList = []
   openingsCache = {}
   chaptersCache = {}

   currentOpening = null
   currentChapter = null

   createOpening = (title, description, color, pgn) => {
      return this.rootStore.api.Openings.create(title, description, color, pgn)
   }

   getOpenings = () => {
      this.rootStore.api.Openings.list().then(data =>
        this.openingList = data
      )
   }

   getOpening = (slug) => {
      if (slug in this.openingsCache) return
      this.rootStore.api.Openings.retrieve(slug).then(data => {
         this.openingsCache[slug] = data
         this.currentOpening = data
         this.rootStore.chessNotation.boardOrientation = data.color === 'w' ? 'white' : 'black'
         this.getChapter(data.chapters[0].id)
      })
   }

   getChapter = (id) => {
      if (id in this.chaptersCache) {
         this.currentChapter = this.chaptersCache[id]
         this.rootStore.chessNotation.loadGameFromJSON(this.chaptersCache[id])
      } else {
         return this.rootStore.api.Openings.chapter(id).then(data => {
            this.chaptersCache[id] = data
            this.currentChapter = data
            this.rootStore.chessNotation.loadGameFromJSON(data)
         })
      }
   }
}

decorate(ChessOpeningsStore, {
   openingList: observable,
   currentOpening: observable,
   currentChapter: observable,
   openingsCache: observable,
   chaptersCache: observable,

   createOpening: action,
   getOpenings: action,
   getOpening: action,
});

export default ChessOpeningsStore;