import React from "react"
import Chess from "chess.js"
import Chessground from "react-chessground"
import "react-chessground/dist/assets/chessground.css"
import "react-chessground/dist/styles/chessground.css"
import "react-chessground/dist/assets/theme.css"
// import queen from "./images/wQ.svg"
// import rook from "./images/wR.svg"
// import bishop from "./images/wB.svg"
// import knight from "./images/wN.svg"
import {Button, Grid, Paper} from "@material-ui/core";
import SkipNextTwoToneIcon from '@material-ui/icons/SkipNextTwoTone';
import SkipPreviousTwoToneIcon from '@material-ui/icons/SkipPreviousTwoTone';
import FastForwardTwoToneIcon from '@material-ui/icons/FastForwardTwoTone';
import FastRewindTwoToneIcon from '@material-ui/icons/FastRewindTwoTone';
import SwapVertTwoToneIcon from '@material-ui/icons/SwapVertTwoTone';


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
            this.setState({index, lastMove: move?[move.from, move.to]:[]})
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
            this.setState({index, lastMove: move?[move.from, move.to]:[]})
        }
    }

    toFirst = () => {
        // console.log(this.moves)
        this.chess.reset()
        this.setState({index: 0, lastMove:[]})
    }

    toLast = () => {
        let move = null
        let index = this.state.index
        while (index < this.moves.length - 2) {
            move = this.chess.move(this.moves[index], {sloppy:true})
            index++;
        }
        // let move = null
        //             if (this.chess.history({verbose:true}).length > 0){
        //         move = this.chess.history({verbose:true})[this.chess.history().length -1]
        //     }

        this.setState({index: this.moves.length -2, lastMove: move?[move.from, move.to]:[]})
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
                        width={window.innerWidth < 880? "90vw":"8px + 9 * ((100vw - 320px) / 880)"}
                        height={window.innerWidth < 880?"90vw":"8px + 9 * ((100vw - 320px) / 880)"}
                        coordinates={false}
                        viewOnly={this.props.viewOnly}
                        orientation={this.props.orientation}
                        fen={this.chess.fen()}
                        style={{margin: "auto"}}

                        lastMove={this.state.lastMove}

                        ref={el => {
                            this.chessground = el
                        }}
                        // resizable={true}
                        // disableContextMenu={true}
                    />
                </div>
                <br/>
                <Grid container alignItems="center" direction={"row"} justify={"center"}>
                    <Button onClick={this.toFirst}><FastRewindTwoToneIcon/></Button>
                    <Button variant={"contained"} style={{backgroundColor: "#00CED1"}} onClick={this.toPrev}><SkipPreviousTwoToneIcon/></Button>
                    <Button variant={"contained"} style={{backgroundColor: "#00CED1"}} onClick={this.toNext}><SkipNextTwoToneIcon/></Button>
                    <Button onClick={this.toLast}><FastForwardTwoToneIcon/></Button>
                    <Button variant={"contained"} color={"primary"} onClick={this.props.onFlip}><SwapVertTwoToneIcon/></Button>
                </Grid>
                <br/>
            </>
        )
    }
}

