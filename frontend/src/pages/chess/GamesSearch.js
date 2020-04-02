import React from "react";
import GamesSearchForm from "../../components/chess/GamesSearchForm";
import {inject, observer} from "mobx-react";
import {Grid} from "@material-ui/core";
import GamesTable from "../../components/chess/GamesTable";

class GamesSearch extends React.Component {
    render() {
        let chess = this.props.stores.chess;
        return (
            <div>
                <Grid container alignItems="center" direction={"row"} justify={"center"}>
                    <Grid item>
                        <GamesSearchForm
                            white={chess.searchValues.white}
                            black={chess.searchValues.black}
                            onKeyPressed={(e) => e.keyCode === 13 ? chess.searchGames() : []}
                            handleWhiteChange={e => this.props.stores.chess.setWhite(e.target.value)}
                            handleBlackChange={e => chess.setBlack(e.target.value)}
                            handleIgnoreChange={e => chess.setIgnore(e.target.checked)}
                            handleSubmitForm={() => chess.searchGames()}
                        />
                    </Grid>
                </Grid>
                <GamesTable games={chess.games}/>
            </div>
        )
    }
}

export default inject('stores')(observer(GamesSearch));