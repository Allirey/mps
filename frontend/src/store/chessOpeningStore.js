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
   tags = []

   createOpening = (title, description, color, tags, image, pgn) => {
      return this.rootStore.api.Openings.create(title, description, color, tags, image, pgn)
   }

   getOpenings = () => this.rootStore.api.Openings.list().then(data => this.openingList = data)

   getOpening = (slug, chapter_id=1) => {
      const processData = (data) => {
         this.currentOpening = data
         this.rootStore.chessNotation.boardOrientation = data.color === 'w' ? 'white' : 'black'
         this.getChapter(data.chapters[Math.max(0, Math.min(chapter_id-1, data.chapters.length - 1))].url)
      }

      if (slug in this.openingsCache) processData(this.openingsCache[slug])
      else this.rootStore.api.Openings.retrieve(slug).then(data => {
         this.openingsCache[slug] = data
         processData(data)
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

   getTags = () => {
      return this.rootStore.api.Openings.tags().then(data => this.tags = data.map(el => el.name))
   }
}

decorate(ChessOpeningsStore, {
   openingList: observable,
   currentOpening: observable,
   currentChapter: observable,
   openingsCache: observable,
   chaptersCache: observable,
   tags: observable,

   createOpening: action,
   getOpenings: action,
   getOpening: action,
   getTags: action,
});

export default ChessOpeningsStore;