import React from 'react';
import {inject, observer} from "mobx-react";
import OpeningTree from '../../components/chess/OpeningTree'

class OpeningExplorer extends React.Component {
    render() {
        return (
            <OpeningTree
                tree={this.props.stores.chess.movesTree}
            />
        )
    }
}

export default inject('stores')(observer(OpeningExplorer));