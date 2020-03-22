import React from 'react'
import ChessBoard from "./LichessBoard"
import {observer, inject} from 'mobx-react';

class ChessGame extends React.Component {
    componentDidMount() {
        this.props.stores.chess.getByUrl(this.props.match.params.url);
    }

    componentWillUnmount() {
        this.props.stores.chess.resetStoredGame();
    }

    render() {
        // console.log(this.props.stores.chess.game)
        let game = this.props.stores.chess.game

        if (game !== null) {
            return (
                <ChessBoard game={game}/>
            )
        } else {
            return <h1></h1>
        }
    }
}

export default inject('stores')(observer(ChessGame));