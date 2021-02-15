import {observable, computed, action, decorate} from 'mobx';
import Chess from 'chess.js'


class ChessMoveLine {
   constructor(parentMove = null) {
      this.parentMove = parentMove
      this.first = null
      this.last = null
   }

   append(moveData, currentNode = null) {
      let move = new ChessMove(this, moveData.fen, moveData.san, moveData.from, moveData.to, moveData.nag)

      if (!this.first) {
         this.first = move
         this.last = move
         return {line: this, node: move}
      }

      if (currentNode && currentNode.next) {
         if (currentNode.next.fen.split(' ')[0] === move.fen.split(' ')[0] && currentNode.next.san === move.san) {
            return {line: this, node: currentNode.next}
         }

         let filteredSubLines = currentNode.next.subLines.filter(x => x.first.fen.split(' ')[0] === move.fen.split(' ')[0]
           && x.first.san === move.san)

         if (!!filteredSubLines.length) {
            move.moveLine = filteredSubLines[0]
            return {line: filteredSubLines[0], node: filteredSubLines[0].first}
         }

         let newline = new ChessMoveLine(currentNode.next)
         move.moveLine = newline
         move.prev = currentNode

         newline.first = move
         newline.last = move
         currentNode.next.subLines.push(newline)
         return {line: newline, node: move}
      }

      this.last.next = move
      move.prev = this.last
      this.last = move

      return {line: this, node: move}
   }

   promoteLine(move) {
      if (move.moveLine.parentMove === null || !move.moveLine.parentMove) return {line: move.moveLine, node: move}

      let toDemote = move.moveLine.parentMove
      let toPromote = move.moveLine.first
      let lineToDemote = new ChessMoveLine(toPromote)
      let lineToPromote = toDemote.moveLine

      toPromote.subLines = toDemote.subLines.filter(x => x.first !== toPromote).concat([lineToDemote])
      toPromote.subLines.forEach(line => line.parentMove = toPromote)

      toDemote.subLines = []
      lineToDemote.first = toDemote
      lineToDemote.parentMove = toPromote

      let cur = toDemote
      while (cur) {
         cur.moveLine = lineToDemote
         if (!cur.next) {
            lineToDemote.last = cur;
            break
         } else cur = cur.next
      }

      cur = toPromote
      while (cur) {
         cur.moveLine = lineToPromote
         if (!cur.next) {
            lineToPromote.last = cur;
            break
         } else cur = cur.next
      }

      toDemote.prev.next = toPromote

      return {line: move.moveLine, node: move}
   }

   deleteNextMoves(move) {
      this.last = move
      move.next = null
   }

   deleteLine(move) {
      if (!move.moveLine.parentMove) {
         move.moveLine.first.next = null
         move.moveLine.last = move.moveLine.first

         return {line: move.moveLine, node: move.moveLine.first}
      } else {
         move.moveLine.parentMove.subLines = move.moveLine.parentMove.subLines.filter(line => line !== move.moveLine)

         return {line: move.prev.moveLine, node: move.moveLine.first.prev}
      }
   }
}

class ChessMove {
   constructor(moveLine, fen, san, from, to, nag) {
      this.moveLine = moveLine
      this.fen = fen
      this.san = san
      this.from = from
      this.to = to
      this.nag = nag ? nag.slice().sort((a, b) => +(a.slice(1, 5)) - +(b.slice(1, 5))) : null

      this.prev = null
      this.next = null
      this.subLines = []
   }
}

class NotationStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
      this.rootLine = new ChessMoveLine()

      const {line, node} = this.rootLine.append({
         fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', san: '', from: '', to: ''
      })

      this.currentNode = node
      this.currentLine = line
   }

   chessGame = new Chess();
   inCheck = false

   boardOrientation = "white";
   gameHeaders = {
      White: "?", WhiteElo: "0", Black: "?", BlackElo: "0", Date: "????.??.??", Event: "?", Result: "*", Site: '?'
   }

   loadGame = (pgn) => {
      this.chessGame.load_pgn(pgn, {sloppy: true})
      let headers = this.chessGame.header() //todo refactor this

      let history = this.chessGame.history()

      this.resetNode()
      this.gameHeaders = headers // todo refactor this

      history.forEach(m => {
         let move = this.chessGame.move(m, {sloppy: true});
         this.rootLine.append({fen: this.chessGame.fen(), san: move.san, from: move.from, to: move.to})
      })

      this.currentNode = this.rootLine.first.next
      this.toPrev()
   }

   loadGameFromJSON = (jsonData) => {
      this.resetNode()
      this.gameHeaders = jsonData.data.headers

      let moves = jsonData.data.moves

      const processMoveLine = (line, currentNode = null) => {
         line.reduce((current, move) => {
            if (move.san.includes('0')) move.san = move.san.replaceAll('0', 'O')

            const {node} = current.moveLine.append({
               fen: move.fen, san: move.san, from: move.from, to: move.to, nag: move.nag
            }, current)

            move.variations && move.variations.forEach(variant => processMoveLine(variant, node.prev))
            return node
         }, currentNode)
      }

      processMoveLine(moves, this.rootLine.first)

      this.currentNode = this.rootLine.first.next
      this.toPrev()
   }

   flipBoard = () => this.boardOrientation = this.boardOrientation === "white" ? "black" : "white";

   jumpToMove = (node) => {
      this.currentNode = node
      this.currentLine = node.moveLine
      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.getExplorerData();
   };

   toNext = () => {
      let node = this.currentNode.next || this.currentNode

      this.currentNode = node
      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.getExplorerData();
   };

   toPrev = () => {
      let node = this.currentNode.prev || this.currentNode

      this.currentNode = node
      this.currentLine = node.moveLine

      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.getExplorerData();
   };

   toFirst = () => {
      this.currentNode = this.rootLine.first
      this.currentLine = this.rootLine
      this.chessGame.load(this.rootLine.first.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = this.rootLine.first.fen
      this.rootStore.chessOpeningExplorer.getExplorerData();
   };

   toLast = () => {
      this.currentNode = this.rootLine.last
      this.currentLine = this.rootLine
      this.chessGame.load(this.rootLine.last.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = this.rootLine.last.fen
      this.rootStore.chessOpeningExplorer.getExplorerData();
   };

   resetNode() {
      this.chessGame = new Chess()

      this.gameHeaders = {
         White: "?", WhiteElo: "0", Black: "?", BlackElo: "0", Date: "????.??.??", Event: "?", Result: "*", Site: '?'
      }

      const {line, node} = new ChessMoveLine().append({
         fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', san: '', from: '', to: ''
      })

      this.currentNode = node
      this.currentLine = line
      this.rootLine = line

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.getExplorerData();
   }

   showPieceSelectMenu = false
   pendingMove = null

   promotion(piece) {
      this.onMove(this.pendingMove.from, this.pendingMove.to, piece)
      this.showPieceSelectMenu = false
      this.pendingMove = null
   }

   onMove = (from, to, piece = 'x') => {
      for (let move of this.chessGame.moves({verbose: true})) {
         if (!this.pendingMove && move.flags.indexOf("p") !== -1 && move.from === from) {
            this.pendingMove = {from, to}
            this.showPieceSelectMenu = true
            return
         }
      }

      let m = this.chessGame.move({from, to, promotion: piece})

      if (m) {
         const {line, node} = this.currentLine.append(
           {fen: this.chessGame.fen(), san: m.san, from: m.from, to: m.to}, this.currentNode)

         this.currentLine = line
         this.currentNode = node

         this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
         this.rootStore.chessOpeningExplorer.getExplorerData();
      }
   }

   makeSanMove = (san) => {
      let m = this.chessGame.move(san, {sloppy: true})

      if (m) {
         const {line, node} = this.currentLine.append(
           {fen: this.chessGame.fen(), san: m.san, from: m.from, to: m.to}, this.currentNode)

         this.currentLine = line
         this.currentNode = node

         this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
         this.rootStore.chessOpeningExplorer.getExplorerData();
      }
   }


   get calcMovable() {
      this.chessGame.load(this.currentNode.fen)
      this.inCheck = this.chessGame.in_check()

      const dests = new Map()
      this.chessGame.SQUARES.forEach(s => {
         const ms = this.chessGame.moves({square: s, verbose: true})
         if (ms.length) dests.set(s, ms.map(m => m.to))
      })
      return {free: false, dests, color: this.turnColor()}
   }

   turnColor = () => {
      return this.chessGame.turn() === "w" ? "white" : "black"
   }

   get lastMove() {
      return this.currentNode.from ? [this.currentNode.from, this.currentNode.to] : [];
   }

   promoteLine = (move) => {
      const {line, node} = move.moveLine.promoteLine(move)

      this.currentNode = node
      this.currentLine = line
      this.chessGame.load(node.fen)
   }

   deleteLine = (move) => {
      const {line, node} = move.moveLine.deleteLine(move)

      this.currentNode = node
      this.currentLine = line

      this.chessGame.load(node.fen)
   }

   deleteRemaining = (move) => {
      this.currentNode = move
      this.currentLine = move.moveLine
      move.moveLine.deleteNextMoves(move)

      this.chessGame.load(move.fen)
   }

   gameToPgn = () => {
      const toArr = linked => {
         const nodes = [];

         let currentNode = linked.first;
         while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
         }
         return nodes
      }

      let headers = ''
      for (let key in this.gameHeaders) {
         headers += `[${key + ''} "${this.gameHeaders[key] + ''}"]\r\n`
      }
      headers += '\r\n'

      let moves = ''
      const processLine = (root, appender = 0) => {
         const moveCount = i => Math.round((i + appender + 1) / 2)
         root.forEach((move, i) => {
            moves += ((i + appender) % 2 ? `${moveCount(i)}.` : (!i && !!move.san) ? `${moveCount(i) - 1}...` : '') + `${move.san} `
            if (move.subLines) {
               move.subLines.forEach(line => {
                  moves += `(`
                  processLine(toArr(line), i + appender)
                  moves += `)`
               })
            }
         })
      }
      processLine(toArr(this.rootLine))
      moves += ` ${this.gameHeaders.Result || '*'}\r\n\r\n`

      return headers + moves.slice(1)
   }
}

decorate(NotationStore, {
     boardOrientation: observable,
     chessGame: observable,
     rootLine: observable,
     currentNode: observable,
     currentLine: observable,
     showPieceSelectMenu: observable,
     pendingMove: observable,
     gameHeaders: observable,

     makeSanMove: action,
     promoteLine: action,
     deleteLine: action,
     deleteRemaining: action,
     loadGame: action,
     flipBoard: action,
     jumpToMove: action,
     toNext: action,
     toPrev: action,
     toFirst: action,
     toLast: action,
     resetNode: action,
     onMove: action,

     calcMovable: computed,
     lastMove: computed,
  }
);

export default NotationStore;