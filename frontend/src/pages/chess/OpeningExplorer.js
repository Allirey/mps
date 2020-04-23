import React from 'react';
import OpeningTree from '../../components/chess/OpeningTree'
import withStore from "../../hocs/withStore";

class OpeningExplorer extends React.Component {
    render() {
        return (
            <OpeningTree
                tree={this.props.stores.chess.movesTree}
            />
        )
    }
}

export default withStore(OpeningExplorer);