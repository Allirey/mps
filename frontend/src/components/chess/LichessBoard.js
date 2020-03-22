import React from "react"
import Chess from "chess.js"
import Chessground from "react-chessground"
import "react-chessground/dist/assets/chessground.css"
import "react-chessground/dist/styles/chessground.css"
import queen from "./images/wQ.svg"
import rook from "./images/wR.svg"
import bishop from "./images/wB.svg"
import knight from "./images/wN.svg"
import {Button, Grid} from "@material-ui/core";

export default class Demo extends React.Component {
    chess = new Chess();

    state = {
        moves: this.props.game.moves.replace(/\n/g, ' ').replace(/\d+\. /g, '').replace(/\$\d+ /g,'').split(' '),
        index: 0,
    };

    toNext = () => {
        if (this.state.index < this.state.moves.length - 2) {
            this.chess.move(this.state.moves[this.state.index])
            let index = this.state.index + 1;
            this.setState({index})
        }

    }
    toPrev = () => {
        if (this.state.index > 0) {
            this.chess.undo()
            let index = this.state.index - 1;
            this.setState({index})
        }
    }

    handleWheel=(e)=>{
        if (e.deltaY < 0){
            this.toPrev();
        }
        else{
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
                        viewOnly={true}
                        fen={this.chess.fen()}
                        style={{margin: "auto"}}
                        ref={el => {
                            this.chessground = el
                        }}
                    /></div>

                <br/>
                <Grid container alignItems="center" direction={"row"} justify={"center"}>
                    <Button variant={"outlined"} color={"primary"} onClick={this.toPrev}>
                        prev </Button>
                    <Button variant={"outlined"} color={"primary"} onClick={this.toNext}>
                        next </Button>
                </Grid>
            </>
        )
    }
}

