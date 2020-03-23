import React from "react"
import Chess from "chess.js"
import Chessground from "react-chessground"
import "react-chessground/dist/assets/chessground.css"
import "react-chessground/dist/styles/chessground.css"
// import queen from "./images/wQ.svg"
// import rook from "./images/wR.svg"
// import bishop from "./images/wB.svg"
// import knight from "./images/wN.svg"
import {Button, Grid} from "@material-ui/core";

export default class extends React.Component {
    chess = new Chess();
    moves = this.props.game.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' ')

    state = {
        index: 0,
        lastMove: null
    };

    toNext = () => {
        if (this.state.index < this.moves.length - 2) {
            let move = this.chess.move(this.moves[this.state.index], {sloppy:true})
            // console.log(this.chess.fen())
            // console.log(this.moves)
            // console.log(this.props.game.moves)
            let index = this.state.index + 1;
            this.setState({index, lastMove: move?[move.from, move.to]:null})
        }

    }
    toPrev = () => {
        if (this.state.index > 0) {
            this.chess.undo()
            let move = null
            if (this.chess.history({verbose:true}).length > 0){
                move = this.chess.history({verbose:true})[this.chess.history().length -1]
            }

            let index = this.state.index - 1;
            this.setState({index, lastMove: move?[move.from, move.to]:null})
        }
    }

    toFirst = () => {
        console.log(this.moves)
        this.chess.reset()
        this.setState({index: 0, lastMove:null})
    }

    toLast = () => {
        let move = null
        let index = this.state.index
        while (index < this.moves.length - 2) {
            move = this.chess.move(this.moves[index])
            index++;
        }
        this.setState({index: this.moves.length -2, lastMove: move?[move.from, move.to]:null})
    }

    handleWheel = (e) => {
        if (e.deltaY < 0) {
            this.toPrev();
        } else {
            this.toNext()
        }
    }

    render() {
        return (
            <>
                <div onWheel={this.handleWheel}>
                    <Chessground
                        width="38vw"
                        height="38vw"
                        viewOnly={this.props.viewOnly}
                        orientation={this.props.orientation}
                        fen={this.chess.fen()}
                        style={{margin: "auto"}}
                        ref={el => {
                            this.chessground = el
                        }}
                        lastMove={this.state.lastMove}
                    />
                </div>
                <br/>
                <Grid container alignItems="center" direction={"row"} justify={"center"}>
                    <Button variant={"outlined"} onClick={this.toFirst}>first</Button>
                    <Button variant={"contained"} onClick={this.toPrev}>prev</Button>
                    <Button variant={"contained"} onClick={this.toNext}>next</Button>
                    <Button variant={"outlined"} onClick={this.toLast}>last</Button>
                    <Button variant={"contained"} color={"primary"} onClick={this.props.onFlip}>flip</Button>
                </Grid>
            </>
        )
    }
}

