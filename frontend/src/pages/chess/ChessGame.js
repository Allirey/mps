import React from 'react'
import ChessBoard from "../../components/chess/LichessBoard"
import {observer, inject} from 'mobx-react';
import {Grid, Paper} from "@material-ui/core";
import ChessNotation from '../../components/chess/GameNotation'

class ChessGame extends React.Component {
    componentDidMount() {
        this.props.stores.chess.getGameByUrl(this.props.match.params.url);
    }

    componentWillUnmount() {
        this.props.stores.chess.resetStoredGame();
    }

    render() {
        // console.log(this.props.stores.chess.game)
        let game = this.props.stores.chess.game

        if (game !== null) {
            return (
                <Grid container direction={"row"} justify="space-evenly">
                    <Grid item>
                    </Grid>
                    <Grid item>
                        <ChessBoard
                            game={game}
                            viewOnly={true}
                            orientation={this.props.stores.chess.boardOrientation}
                            onFlip={this.props.stores.chess.flipBoard}
                        />
                    </Grid>
                    <Grid item>
                        <Paper style={{padding: 15, background: "rgb(240, 235, 235)"}}>
                        <ChessNotation game={game}/>
                        </Paper>
                    </Grid>
                </Grid>
            )
        } else {
            return <h1>
            </h1>
        }
    }
}

export default inject('stores')(observer(ChessGame));