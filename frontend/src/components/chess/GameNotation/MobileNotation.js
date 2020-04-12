import React, {PureComponent} from 'react'
import {Typography} from "@material-ui/core";

export default class extends PureComponent {

    render() {
        return (
                <Typography style={{maxHeight:"250px", maxWidth:"100vw", overflow: "auto", fontSize: 13}}>
                    <p><strong>{this.props.game.white} - {this.props.game.black} {this.props.game.result}</strong></p>
                    <p>{this.props.game.moves}</p>
                </Typography>
        );
    }
}